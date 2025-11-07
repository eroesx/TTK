import React, { useState, useRef } from 'react';
import type { ViewQuestionsModalProps, Question } from '../types';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import EditQuestionModal from './EditQuestionModal';
import DownloadIcon from './icons/DownloadIcon';
import UploadIcon from './icons/UploadIcon';

const ViewQuestionsModal: React.FC<ViewQuestionsModalProps> = ({ topic, onClose, onEditQuestion, onDeleteQuestion, onAddBulkQuestions }) => {
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (questionId: number) => {
    if (window.confirm("Bu soruyu kalıcı olarak silmek istediğinizden emin misiniz?")) {
        onDeleteQuestion(questionId);
    }
  };

  const handleSaveEdit = (updatedQuestion: Question) => {
    onEditQuestion(updatedQuestion);
    setQuestionToEdit(null);
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
            item.options.length !== 4 ||
            !item.options.every((opt: any) => typeof opt === 'string' && opt.trim()) ||
            typeof item.correctAnswerIndex !== 'number' ||
            !Number.isInteger(item.correctAnswerIndex) ||
            item.correctAnswerIndex < 0 ||
            item.correctAnswerIndex > 3
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

          <div className="overflow-y-auto pr-4 -mr-4">
              {topic.questions.length > 0 ? (
                  <ul className="space-y-6">
                      {topic.questions.map((question, qIndex) => (
                          <li key={question.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative group">
                              <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button onClick={() => setQuestionToEdit(question)} title="Soruyu Düzenle" className="p-1.5 rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white">
                                      <EditIcon />
                                  </button>
                                  <button onClick={() => handleDelete(question.id)} title="Soruyu Sil" className="p-1.5 rounded-full bg-slate-700 text-slate-300 hover:bg-red-500 hover:text-white">
                                      <TrashIcon />
                                  </button>
                              </div>
                              <p className="font-semibold text-white mb-3 pr-20">{qIndex + 1}. {question.questionText}</p>
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
                          </li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-center text-slate-400 py-8">Bu konu için henüz soru eklenmemiş.</p>
              )}
          </div>
        </div>
      </div>
      {questionToEdit && (
        <EditQuestionModal
            question={questionToEdit}
            onClose={() => setQuestionToEdit(null)}
            onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default ViewQuestionsModal;