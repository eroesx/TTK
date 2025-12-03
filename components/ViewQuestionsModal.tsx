
import React, { useState, useRef, useMemo } from 'react';
import type { ViewQuestionsModalProps, Question } from '../types';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import NoteIcon from './icons/NoteIcon';
import EditQuestionModal from './EditQuestionModal';
import DownloadIcon from './icons/DownloadIcon';
import UploadIcon from './icons/UploadIcon';
import SearchIcon from './icons/SearchIcon';
import AddIcon from './icons/AddIcon';
import PasteIcon from './icons/PasteIcon';
import PrinterIcon from './icons/PrinterIcon';
import BulkAddQuestionsModal from './BulkAddQuestionsModal';

const ViewQuestionsModal: React.FC<ViewQuestionsModalProps> = ({ topic, onClose, onEditQuestion, onDeleteQuestion, onAddBulkQuestions, onOpenAddQuestionModal }) => {
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Print States
  const [isPrintSettingsOpen, setIsPrintSettingsOpen] = useState(false);
  const [printCount, setPrintCount] = useState(topic.questions.length);
  const [printShuffle, setPrintShuffle] = useState(false);

  // State for inline note editing
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState('');

  const handleDelete = (questionId: number) => {
    if (window.confirm("Bu soruyu kalıcı olarak silmek istediğinizden emin misiniz?")) {
        onDeleteQuestion(questionId);
    }
  };

  const handleSaveEdit = (updatedQuestion: Question) => {
    onEditQuestion(updatedQuestion);
    setQuestionToEdit(null);
  };

  const handleEditNoteClick = (question: Question) => {
    if (editingNoteId === question.id) {
        setEditingNoteId(null); // Toggle off if already editing
    } else {
        setEditingNoteId(question.id);
        setCurrentNote(question.note || '');
    }
  };

  const handleSaveNote = (question: Question) => {
    const updatedQuestion = { ...question, note: currentNote };
    onEditQuestion(updatedQuestion);
    setEditingNoteId(null);
  };


  const handleExport = () => {
    const questionsTemplate = topic.questions.map(({ questionText, options, correctAnswerIndex }) => ({
      questionText,
      options,
      correctAnswerIndex,
    }));

    const jsonString = JSON.stringify(questionsTemplate, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    const fileName = `${topic.name.replace(/\s+/g, '_').toLowerCase()}_sorular.json`;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleImportTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      if (event.target) event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') throw new Error("Dosya içeriği okunamadı.");
        
        const parsedData = JSON.parse(content);
        
        if (!Array.isArray(parsedData)) throw new Error("JSON dosyası bir dizi (array) olmalıdır.");
        
        const newQuestions: Question[] = [];
        for (let i = 0; i < parsedData.length; i++) {
          const item = parsedData[i];
          if (
            typeof item.questionText !== 'string' || !item.questionText.trim() ||
            !Array.isArray(item.options) ||
            item.options.length < 2 || // En az 2 seçenek olmalı
            !item.options.every((opt: any) => typeof opt === 'string' && opt.trim()) ||
            typeof item.correctAnswerIndex !== 'number' ||
            !Number.isInteger(item.correctAnswerIndex) ||
            item.correctAnswerIndex < 0 ||
            item.correctAnswerIndex >= item.options.length // Cevap indeksi seçenek sayısını aşmamalı
          ) {
            throw new Error(`Dosyadaki ${i + 1}. sıradaki soru formatı geçersiz. Lütfen şablonu kontrol edin.`);
          }
          newQuestions.push({
            id: Date.now() + i,
            questionText: item.questionText.trim(),
            options: item.options.map((opt:string) => opt.trim()),
            correctAnswerIndex: item.correctAnswerIndex,
          });
        }

        if (newQuestions.length === 0) {
            alert("Dosyada eklenecek geçerli soru bulunamadı.");
            return;
        }

        if (window.confirm(`${newQuestions.length} adet soru bu konuya eklenecek. Onaylıyor musunuz?`)) {
          onAddBulkQuestions(topic.id, newQuestions);
          alert(`${newQuestions.length} soru başarıyla eklendi.`);
        }
      } catch (error) {
        if (error instanceof Error) {
            alert(`Dosya işlenirken hata oluştu: ${error.message}`);
        } else {
            alert("Bilinmeyen bir hata oluştu.");
        }
      } finally {
        if (event.target) {
            event.target.value = '';
        }
      }
    };
    reader.onerror = () => {
        alert("Dosya okunurken bir hata oluştu.");
        if (event.target) event.target.value = '';
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    // 1. Filter and Sort
    let questionsToPrint = [...topic.questions];
    if (printShuffle) {
        questionsToPrint.sort(() => 0.5 - Math.random());
    }
    
    // 2. Slice based on count
    const limit = Math.max(1, Math.min(printCount, questionsToPrint.length));
    questionsToPrint = questionsToPrint.slice(0, limit);

    // 3. Open Window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Pop-up engelleyiciyi kapatınız.");
        return;
    }

    // 4. Construct HTML
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8">
            <title>GYS SoruBankası</title>
            <style>
                body { font-family: 'Times New Roman', serif; line-height: 1.5; color: #000; padding: 20px; }
                h1 { text-align: center; font-size: 24px; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 10px; }
                .info { text-align: center; margin-bottom: 30px; font-style: italic; font-size: 14px; }
                .question-container { margin-bottom: 20px; page-break-inside: avoid; }
                .question-text { font-weight: bold; margin-bottom: 8px; }
                .options-list { list-style-type: none; padding-left: 0; margin-top: 5px; }
                .option-item { margin-bottom: 4px; padding-left: 20px; text-indent: -20px; }
                .answer-key-section { margin-top: 50px; page-break-before: always; }
                .answer-key-title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 20px; text-decoration: underline; }
                .answer-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; font-size: 14px; }
                @media print {
                    .no-print { display: none; }
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            <h1>${topic.name}</h1>
            <div class="info">Toplam ${limit} Soru | Tarih: ${new Date().toLocaleDateString('tr-TR')}</div>

            <div class="questions-wrapper">
                ${questionsToPrint.map((q, index) => `
                    <div class="question-container">
                        <div class="question-text">${index + 1}. ${q.questionText}</div>
                        <ul class="options-list">
                            ${q.options.map((opt, optIndex) => `
                                <li class="option-item">
                                    <strong>${String.fromCharCode(65 + optIndex)})</strong> ${opt}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>

            <div class="answer-key-section">
                <div class="answer-key-title">CEVAP ANAHTARI</div>
                <div class="answer-grid">
                    ${questionsToPrint.map((q, index) => `
                        <div>
                            <strong>${index + 1}.</strong> ${String.fromCharCode(65 + q.correctAnswerIndex)}
                        </div>
                    `).join('')}
                </div>
            </div>

            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setIsPrintSettingsOpen(false);
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const filteredQuestions = useMemo(() => {
    return topic.questions.filter(q => {
      const term = searchTerm.toLowerCase();
      if (!term) return true;
      const questionTextMatch = q.questionText.toLowerCase().includes(term);
      const optionsMatch = q.options.some(opt => opt.toLowerCase().includes(term));
      const noteMatch = q.note ? stripHtml(q.note).toLowerCase().includes(term) : false;
      return questionTextMatch || optionsMatch || noteMatch;
    });
  }, [topic.questions, searchTerm]);

  const handleAddNewQuestionClick = () => {
    onOpenAddQuestionModal(topic);
    onClose();
  };

  return (
    <>
      <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={onClose}
      >
        <div
          className="bg-slate-800 rounded-2xl p-8 w-full max-w-4xl shadow-2xl relative max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6 shrink-0">
            <h2 className="text-2xl font-bold text-cyan-400 pt-1 pr-16">
              <span className="text-slate-400 font-normal">Konu:</span> {topic.name}
            </h2>
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <button 
                  onClick={() => setIsPrintSettingsOpen(true)}
                  title="Soruları Yazdır" 
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <PrinterIcon className="h-6 w-6" />
                </button>
                <button 
                  onClick={() => setIsBulkAddModalOpen(true)}
                  title="Metin ile Toplu Soru Ekle" 
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <PasteIcon className="h-6 w-6" />
                </button>
                <button 
                  onClick={handleImportTrigger} 
                  title="Şablondan Soru Yükle" 
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <UploadIcon className="h-6 w-6" />
                </button>
                <button 
                  onClick={handleExport} 
                  title="Soruları Şablon Olarak İndir" 
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <DownloadIcon className="h-6 w-6" />
                </button>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="application/json"
            className="hidden"
          />

          <div className="relative mb-4 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                placeholder="Sorular veya ipuçları içinde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                aria-label="Soruları filtrele"
            />
          </div>

          <div className="overflow-y-auto pr-4 -mr-4">
              {filteredQuestions.length > 0 ? (
                  <ul className="space-y-6">
                      {filteredQuestions.map((question) => (
                          <li key={question.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative group">
                              <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button onClick={() => handleEditNoteClick(question)} title="İpucu Ekle/Düzenle" className="p-1.5 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white">
                                    <NoteIcon className="h-5 w-5" />
                                  </button>
                                  <button onClick={() => setQuestionToEdit(question)} title="Soruyu Düzenle" className="p-1.5 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white">
                                      <EditIcon />
                                  </button>
                                  <button onClick={() => handleDelete(question.id)} title="Soruyu Sil" className="p-1.5 rounded-full bg-slate-700 text-slate-300 hover:bg-red-500 hover:text-white">
                                      <TrashIcon />
                                  </button>
                              </div>
                              <p className="font-semibold text-white mb-3 pr-28">{topic.questions.findIndex(q => q.id === question.id) + 1}. {question.questionText}</p>
                              <ul className="space-y-2">
                                  {question.options.map((option, oIndex) => (
                                      <li
                                          key={oIndex}
                                          className={`pl-4 py-2 rounded-md text-sm ${
                                              oIndex === question.correctAnswerIndex
                                              ? 'bg-green-500/20 text-green-300 border-l-4 border-green-400'
                                              : 'text-slate-300'
                                          }`}
                                      >
                                          {option}
                                      </li>
                                  ))}
                              </ul>
                                {editingNoteId === question.id ? (
                                    <div className="mt-4 animate-fade-in">
                                        <label htmlFor={`note-editor-${question.id}`} className="block text-sm font-medium text-slate-300 mb-2">İpucu / Not</label>
                                        <textarea
                                            id={`note-editor-${question.id}`}
                                            value={currentNote}
                                            onChange={(e) => setCurrentNote(e.target.value)}
                                            rows={3}
                                            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                                            placeholder="Bu soru için bir ipucu veya not ekleyin..."
                                        />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button onClick={() => setEditingNoteId(null)} className="px-3 py-1 text-sm rounded-md bg-slate-600 hover:bg-slate-500 transition-colors">İptal</button>
                                            <button onClick={() => handleSaveNote(question)} className="px-3 py-1 text-sm rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Kaydet</button>
                                        </div>
                                    </div>
                                ) : (
                                    question.note && (
                                    <div className="mt-4 p-3 bg-slate-800/50 rounded-md border border-slate-700/50">
                                        <p className="text-sm font-medium text-amber-300 mb-1">Kaydedilmiş İpucu:</p>
                                        <div className="text-sm text-slate-300 prose-dark max-w-none" dangerouslySetInnerHTML={{ __html: question.note }} />
                                    </div>
                                    )
                                )}
                          </li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-center text-slate-400 py-8">
                    {topic.questions.length > 0 ? `"${searchTerm}" ile eşleşen soru bulunamadı.` : 'Bu konu için henüz soru eklenmemiş.'}
                  </p>
              )}
          </div>
          <button
            onClick={handleAddNewQuestionClick}
            title="Yeni Soru Ekle"
            aria-label="Yeni Soru Ekle"
            className="absolute bottom-8 right-8 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 z-10"
          >
              <AddIcon className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* Print Settings Modal */}
      {isPrintSettingsOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60] animate-fade-in" onClick={() => setIsPrintSettingsOpen(false)}>
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative border border-slate-700" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Yazdırma Seçenekleri</h3>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="printCount" className="block text-sm font-medium text-slate-300 mb-2">Soru Sayısı (Toplam: {topic.questions.length})</label>
                        <input 
                            type="number" 
                            id="printCount" 
                            min="1" 
                            max={topic.questions.length} 
                            value={printCount} 
                            onChange={(e) => setPrintCount(Number(e.target.value))} 
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            id="printShuffle" 
                            checked={printShuffle} 
                            onChange={(e) => setPrintShuffle(e.target.checked)} 
                            className="w-4 h-4 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
                        />
                        <label htmlFor="printShuffle" className="ml-2 text-sm font-medium text-slate-300">Soruları Karıştır</label>
                    </div>
                    
                    <div className="text-xs text-slate-400 mt-2">
                        * Yazdırılan belgenin en sonunda cevap anahtarı bulunacaktır.
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setIsPrintSettingsOpen(false)} className="px-4 py-2 text-sm rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-white">İptal</button>
                    <button onClick={handlePrint} className="px-4 py-2 text-sm rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors text-white flex items-center gap-2">
                        <PrinterIcon className="h-4 w-4" />
                        Yazdır
                    </button>
                </div>
            </div>
        </div>
      )}

      {questionToEdit && (
        <EditQuestionModal
            question={questionToEdit}
            onClose={() => setQuestionToEdit(null)}
            onSave={handleSaveEdit}
        />
      )}
      {isBulkAddModalOpen && (
        <BulkAddQuestionsModal
            topic={topic}
            onClose={() => setIsBulkAddModalOpen(false)}
            onAddQuestions={onAddBulkQuestions}
        />
      )}
    </>
  );
};

export default ViewQuestionsModal;
