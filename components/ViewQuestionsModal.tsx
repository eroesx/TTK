
import React, { useState, useRef, useMemo, useEffect } from 'react';
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
import TextNIcon from './icons/TextNIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import BulkAddQuestionsModal from './BulkAddQuestionsModal';

declare const Quill: any; // Declare Quill to avoid TypeScript errors

const ViewQuestionsModal: React.FC<ViewQuestionsModalProps> = ({ topic, onClose, onEditQuestion, onDeleteQuestion, onAddBulkQuestions, onReplaceQuestions, onOpenAddQuestionModal }) => {
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingImportQuestions, setPendingImportQuestions] = useState<Question[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Print States
  const [isPrintSettingsOpen, setIsPrintSettingsOpen] = useState(false);
  const [printCount, setPrintCount] = useState(topic.questions.length);
  const [printShuffle, setPrintShuffle] = useState(false);

  // State for inline note editing
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState(''); // This will hold HTML content
  const quillInstanceRef = useRef<any>(null); // Ref for the single Quill instance used for inline editing

  // State for toggling all notes visibility
  const [viewAllNotesMode, setViewAllNotesMode] = useState(false);

  // Scroll Management
  const [lastInteractedQuestionId, setLastInteractedQuestionId] = useState<number | null>(null);
  const questionRefs = useRef<{ [key: number]: HTMLLIElement | null }>({});

  // Effect to scroll to the last interacted question after data update
  useEffect(() => {
    if (lastInteractedQuestionId !== null && questionRefs.current[lastInteractedQuestionId]) {
        // Use a small timeout to ensure DOM is fully painted
        setTimeout(() => {
            questionRefs.current[lastInteractedQuestionId]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            setLastInteractedQuestionId(null); // Reset after scrolling
        }, 100);
    }
  }, [topic, lastInteractedQuestionId]);

  // FIX: Robust Quill Initialization and Cleanup
  useEffect(() => {
    // If we are not editing any note, ensure we clean up any lingering instance
    if (editingNoteId === null) {
        return;
    }

    const editorElementId = `note-editor-${editingNoteId}`;
    const editorContainer = document.getElementById(editorElementId);

    if (!editorContainer || typeof Quill === 'undefined') return;

    // CLEANUP PRE-CHECK: Remove any existing toolbar or content that might be left over
    // This prevents "double toolbar" issues if cleanup wasn't perfect previously
    const potentialToolbar = editorContainer.previousElementSibling;
    if (potentialToolbar && potentialToolbar.classList.contains('ql-toolbar')) {
        potentialToolbar.remove();
    }
    editorContainer.innerHTML = '';

    // Create a new Quill instance
    const quill = new Quill(editorContainer, {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }],
          ['clean']
        ]
      },
      placeholder: 'Bu soru için bir ipucu veya not ekleyin...',
      theme: 'snow',
    });

    // Set initial content from state
    quill.root.innerHTML = currentNote;

    // Update state on change
    quill.on('text-change', () => {
      setCurrentNote(quill.root.innerHTML);
    });

    // Store in ref for external access (save button)
    quillInstanceRef.current = quill;
    
    // Enable and Focus
    quill.enable();
    // Small timeout to ensure DOM focus works
    setTimeout(() => {
        try {
            quill.focus();
        } catch(e) {
            console.warn("Quill focus failed", e);
        }
    }, 50);

    // Cleanup function: Destroy specific instance when component unmounts or ID changes
    return () => {
        if (quill) {
            quill.off('text-change');
            // Manual cleanup of DOM elements since quill.destroy() might not fully handle React re-renders correctly
            const toolbar = editorContainer.previousElementSibling;
            if (toolbar && toolbar.classList.contains('ql-toolbar')) {
                toolbar.remove();
            }
            editorContainer.innerHTML = ''; // Clear the editor content container
        }
        if (quillInstanceRef.current === quill) {
            quillInstanceRef.current = null;
        }
    };
  }, [editingNoteId]); // Only re-run if the target question changes


  const handleDelete = (questionId: number) => {
    if (window.confirm("Bu soruyu kalıcı olarak silmek istediğinizden emin misiniz?")) {
        onDeleteQuestion(questionId);
        if (editingNoteId === questionId) { // If the deleted question's note was being edited
            setEditingNoteId(null);
            setCurrentNote(''); // Clear current note content
        }
    }
  };

  const handleSaveEdit = (updatedQuestion: Question) => {
    setLastInteractedQuestionId(updatedQuestion.id); // Track ID to scroll back
    onEditQuestion(updatedQuestion);
    setQuestionToEdit(null);
  };

  const handleEditNoteClick = (question: Question) => {
    if (editingNoteId === question.id) {
        setEditingNoteId(null); // Toggle off if already editing
        setCurrentNote(''); // Clear current note content
    } else {
        // Set current note from question.note or empty string if null/undefined
        setCurrentNote(question.note || '');
        setEditingNoteId(question.id);
        setLastInteractedQuestionId(question.id); // Prepare for potential save
    }
  };

  const handleSaveNote = (question: Question) => {
    if (!quillInstanceRef.current || typeof quillInstanceRef.current.root.innerHTML === 'undefined') {
      console.error("Quill instance or its content not available for saving.");
      return; 
    }
    const updatedNoteContent = quillInstanceRef.current.root.innerHTML;
    const updatedQuestion = { ...question, note: updatedNoteContent };
    
    setLastInteractedQuestionId(question.id); // Track ID to scroll back
    onEditQuestion(updatedQuestion);
    
    setEditingNoteId(null);
    setCurrentNote(''); // Clear currentNote state after saving
  };


  const handleExport = () => {
    const questionsTemplate = topic.questions.map(({ questionText, options, correctAnswerIndex, note }) => ({
      questionText,
      options,
      correctAnswerIndex,
      note, // Include note in export
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
            note: item.note || undefined, // Include note in import
          });
        }

        if (newQuestions.length === 0) {
            alert("Dosyada eklenecek geçerli soru bulunamadı.");
            return;
        }

        setPendingImportQuestions(newQuestions);

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

  const handleImportAppend = () => {
    if (pendingImportQuestions) {
        onAddBulkQuestions(topic.id, pendingImportQuestions);
        alert(`${pendingImportQuestions.length} soru mevcut sorulara eklendi.`);
        setPendingImportQuestions(null);
    }
  };

  const handleImportReplace = () => {
    if (pendingImportQuestions) {
        if (window.confirm("Bu işlem mevcut tüm soruları silecek ve yerine dosyadaki soruları yükleyecektir. Emin misiniz?")) {
            onReplaceQuestions(topic.id, pendingImportQuestions);
            alert(`Sorular güncellendi. Toplam ${pendingImportQuestions.length} soru yüklendi.`);
            setPendingImportQuestions(null);
        }
    }
  };

  const handleImportCancel = () => {
    setPendingImportQuestions(null);
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
                    @page {
                        margin: 0;
                    }
                    body {
                        padding: 0;
                        margin: 0;
                    }
                    /* Hide elements not meant for print */
                    .no-print { display: none !important; }
                }
            </style>
        </head>
        <body>
            <h1>${topic.name}</h1>
            <div class="info no-print">Toplam ${limit} Soru | Tarih: ${new Date().toLocaleDateString('tr-TR')}</div>
            <div class="info">Toplam ${limit} Soru</div>

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
      const questionTextMatch = stripHtml(q.questionText).toLowerCase().includes(term); // Search in plain text
      const optionsMatch = q.options.some(opt => opt.toLowerCase().includes(term));
      const noteMatch = q.note ? stripHtml(q.note).toLowerCase().includes(term) : false;
      return questionTextMatch || optionsMatch || noteMatch;
    });
  }, [topic.questions, searchTerm]);

  const handleAddNewQuestionClick = () => {
    onOpenAddQuestionModal(topic);
  };

  return (
    <>
      <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-0 md:p-4 z-50 animate-fade-in"
          onClick={onClose}
      >
        <div
          className="bg-slate-800 md:rounded-2xl w-full md:w-full max-w-4xl shadow-2xl relative h-full md:h-auto md:max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start p-6 pb-2 shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-cyan-400 pt-1 pr-16 truncate">
              <span className="text-slate-400 font-normal hidden md:inline">Konu:</span> {topic.name}
            </h2>
            <div className="absolute top-4 right-4 flex items-center gap-1 md:gap-2">
                <button
                    onClick={handleAddNewQuestionClick}
                    title="Yeni Soru Ekle"
                    aria-label="Yeni Soru Ekle"
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <AddIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setViewAllNotesMode(prev => !prev)}
                  title={viewAllNotesMode ? "Notları Gizle" : "Tüm Notları Düzenle"}
                  className={`p-2 rounded-full transition-colors ${viewAllNotesMode ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                >
                    <TextNIcon className="h-6 w-6" />
                </button>
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
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors ml-2" title="Kapat">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
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

          <div className="relative mb-4 shrink-0 px-6">
            <div className="absolute inset-y-0 left-6 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                placeholder="Sorular veya ipuçları içinde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                aria-label="Soruları filtrele"
            />
          </div>

          <div className="overflow-y-auto px-6 pb-20 md:pb-6 flex-grow">
              {filteredQuestions.length > 0 ? (
                  <ul className="space-y-6">
                      {filteredQuestions.map((question) => {
                          const isEditingNote = editingNoteId === question.id;
                          return (
                          <li 
                            key={question.id} 
                            ref={el => { if(el) questionRefs.current[question.id] = el; }}
                            className={`bg-slate-900/50 p-4 rounded-lg border relative group transition-all duration-300 ${isEditingNote ? 'border-cyan-500 ring-1 ring-cyan-500/50 bg-slate-800' : 'border-slate-700 hover:border-slate-500'}`}
                          >
                              <div className="absolute top-2 right-2 flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                  <button 
                                    onClick={() => handleEditNoteClick(question)} 
                                    title={question.note ? "İpucu/Notu Düzenle" : "İpucu/Not Ekle"} 
                                    className={`p-2 rounded-full transition-colors ${question.note ? 'bg-amber-900/40 text-amber-400 hover:bg-amber-800' : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'}`}
                                  >
                                    <NoteIcon className="h-5 w-5" />
                                  </button>
                                  <button onClick={() => setQuestionToEdit(question)} title="Soruyu Düzenle" className="p-2 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white">
                                      <EditIcon />
                                  </button>
                                  <button onClick={() => handleDelete(question.id)} title="Soruyu Sil" className="p-2 rounded-full bg-slate-700 text-slate-300 hover:bg-red-500 hover:text-white">
                                      <TrashIcon />
                                  </button>
                              </div>
                              <div className="font-semibold text-white mb-3 pr-28 text-base md:text-lg flex gap-2">
                                <span className="text-cyan-500 shrink-0">{topic.questions.findIndex(q => q.id === question.id) + 1}.</span>
                                {/* Render Question Text HTML */}
                                <div dangerouslySetInnerHTML={{ __html: question.questionText }} className="prose-dark max-w-none [&>p]:inline [&>p]:m-0" />
                              </div>
                              <ul className="space-y-2 mb-2">
                                  {question.options.map((option, oIndex) => (
                                      <li
                                          key={oIndex}
                                          className={`pl-4 py-2 rounded-md text-sm md:text-base ${
                                              oIndex === question.correctAnswerIndex
                                              ? 'bg-green-500/20 text-green-300 border-l-4 border-green-400'
                                              : 'text-slate-300'
                                          }`}
                                      >
                                          {option}
                                      </li>
                                  ))}
                              </ul>
                                {isEditingNote ? (
                                    <div className="mt-4 animate-fade-in bg-slate-900 p-3 rounded-md border border-cyan-500/50">
                                        <div className="flex items-center gap-2 mb-2 text-cyan-400">
                                            <NoteIcon className="h-4 w-4" />
                                            <span className="text-sm font-semibold">Not Düzenleniyor</span>
                                        </div>
                                        <div id={`note-editor-${question.id}`} className="quill-editor" />
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button onClick={() => setEditingNoteId(null)} className="px-3 py-1.5 text-sm rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
                                            <button onClick={() => handleSaveNote(question)} className="px-3 py-1.5 text-sm rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Kaydet</button>
                                        </div>
                                    </div>
                                ) : (
                                    (question.note || viewAllNotesMode) && (
                                    <div 
                                        onClick={() => handleEditNoteClick(question)}
                                        className={`mt-3 p-3 rounded-md border transition-all cursor-pointer group/note
                                            ${question.note 
                                                ? 'bg-amber-900/20 border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-900/30' 
                                                : 'bg-slate-800/30 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                                            }
                                        `}
                                        title="Düzenlemek için tıklayın"
                                    >
                                        {question.note ? (
                                            <>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                                                        <LightbulbIcon isActive={true} className="w-3 h-3" /> İpucu / Not
                                                    </span>
                                                    <EditIcon className="w-4 h-4 text-slate-500 opacity-0 group-hover/note:opacity-100 transition-opacity" />
                                                </div>
                                                <div className="text-sm text-slate-300 prose-dark max-w-none pl-1 border-l-2 border-amber-500/50" dangerouslySetInnerHTML={{ __html: question.note }} />
                                            </>
                                        ) : (
                                            <span className="text-sm text-slate-500 italic flex items-center justify-center gap-2 py-1 group-hover/note:text-cyan-400 transition-colors">
                                                <AddIcon className="h-4 w-4" /> İpucu / Not eklemek için tıklayın
                                            </span>
                                        )}
                                    </div>
                                    )
                                )}
                          </li>
                      )})}
                  </ul>
              ) : (
                  <p className="text-center text-slate-400 py-8">
                    {topic.questions.length > 0 ? `"${searchTerm}" ile eşleşen soru bulunamadı.` : 'Bu konu için henüz soru eklenmemiş.'}
                  </p>
              )}
          </div>
        </div>
      </div>

      {/* Import Confirmation Modal */}
      {pendingImportQuestions && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60] animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl relative border border-slate-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 text-center">Soru Yükleme Seçeneği</h3>
                <p className="text-slate-300 mb-6 text-center">
                    Dosyada <strong>{pendingImportQuestions.length}</strong> adet soru bulundu.
                    <br/><br/>
                    Mevcut <strong>{topic.questions.length}</strong> sorunuzla nasıl işlem yapmak istersiniz?
                </p>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleImportReplace}
                        className="w-full px-4 py-3 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-semibold transition-colors border border-red-500/50 flex flex-col items-center"
                    >
                        <span>Mevcutların Üzerine Yaz</span>
                        <span className="text-xs font-normal opacity-80 mt-1">(Eski sorular silinir, sadece yeniler kalır)</span>
                    </button>
                    
                    <button 
                        onClick={handleImportAppend}
                        className="w-full px-4 py-3 rounded-lg bg-green-600/90 hover:bg-green-500 text-white font-semibold transition-colors border border-green-500/50 flex flex-col items-center"
                    >
                        <span>Mevcutlara Ekle</span>
                        <span className="text-xs font-normal opacity-80 mt-1">(Eski sorular kalır, yeniler listenin sonuna eklenir)</span>
                    </button>
                    
                    <button 
                        onClick={handleImportCancel}
                        className="w-full px-4 py-2 mt-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                    >
                        İptal
                    </button>
                </div>
            </div>
        </div>
      )}

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
