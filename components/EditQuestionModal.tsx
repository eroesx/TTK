
import React, { useState, useEffect, useRef } from 'react';
import type { Question } from '../types';
import TrashIcon from './icons/TrashIcon';
import AddIcon from './icons/AddIcon';

declare const Quill: any;

interface EditQuestionModalProps {
  question: Question;
  onSave: (updatedQuestion: Question) => void;
  onClose: () => void;
  onDelete?: () => void;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({ question, onSave, onClose, onDelete }) => {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);
  const [error, setError] = useState('');
  
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);

  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  // Initialize Quill
  useEffect(() => {
    if (editorRef.current && typeof Quill !== 'undefined' && !quillInstanceRef.current) {
      quillInstanceRef.current = new Quill(editorRef.current, {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'color': [] }],
            ['clean']
          ]
        },
        placeholder: 'Soruyu buraya yazın...',
        theme: 'snow',
      });

      // Set initial content
      quillInstanceRef.current.root.innerHTML = question.questionText;

      // Listen for changes
      quillInstanceRef.current.on('text-change', () => {
        const html = quillInstanceRef.current.root.innerHTML;
        setEditedQuestion(prev => ({ ...prev, questionText: html }));
      });
    }

    return () => {
        if (quillInstanceRef.current && typeof quillInstanceRef.current.destroy === 'function') {
            // Check if element still exists before destroying to avoid errors
            if (editorRef.current) {
                quillInstanceRef.current.destroy();
            }
            quillInstanceRef.current = null;
        }
    };
  }, []); // Run once on mount

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  const handleCorrectAnswerChange = (index: number) => {
    setEditedQuestion({ ...editedQuestion, correctAnswerIndex: index });
  };

  const handleAddOption = () => {
    if (editedQuestion.options.length < 5) { // Allow up to 5 options
      setEditedQuestion({
        ...editedQuestion,
        options: [...editedQuestion.options, '']
      });
    }
  };

  const handleRemoveOption = (indexToRemove: number) => {
    if (editedQuestion.options.length <= 2) return; // Must have at least 2 options

    const newOptions = editedQuestion.options.filter((_, i) => i !== indexToRemove);
    let newCorrectIndex = editedQuestion.correctAnswerIndex;

    // Reset correct answer if it's the one being removed
    // Shift index if removed option was before correct answer
    if (newCorrectIndex === indexToRemove) {
      newCorrectIndex = 0; // Default to 0, user must re-select
    } else if (newCorrectIndex !== null && newCorrectIndex > indexToRemove) {
      newCorrectIndex = newCorrectIndex - 1;
    }

    setEditedQuestion({
      ...editedQuestion,
      options: newOptions,
      correctAnswerIndex: newCorrectIndex
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Quill has content (stripping HTML tags to check for empty text)
    const currentText = quillInstanceRef.current ? quillInstanceRef.current.getText().trim() : editedQuestion.questionText;

    if (!currentText && !editedQuestion.questionText.includes('<img')) { // Allow image-only questions if supported later
      setError('Soru metni boş olamaz.');
      return;
    }
    if (editedQuestion.options.some(opt => !opt.trim())) {
      setError('Tüm seçenekler doldurulmalıdır.');
      return;
    }
    onSave(editedQuestion);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-0 md:p-4 z-[70] animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 md:rounded-2xl p-6 w-full max-w-3xl shadow-2xl relative h-full md:h-auto md:max-h-[90vh] flex flex-col border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            {onDelete && (
                <button 
                    onClick={onDelete} 
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-full hover:bg-slate-700 group"
                    title="Soruyu Tamamen Sil"
                >
                    <TrashIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <h2 className="text-2xl font-bold text-cyan-400 mb-6 shrink-0 pr-24">
          Soruyu Düzenle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 flex-grow overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Soru Metni</label>
            <div className="bg-slate-900 border border-slate-700 rounded-md overflow-hidden">
                <div ref={editorRef} className="quill-editor" style={{ minHeight: '120px', fontSize: '1rem', color: '#fff' }} />
            </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-300 mb-2">Seçenekler (Doğru olanı işaretleyin)</label>
             <div className="space-y-3">
                {editedQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="correctAnswer"
                            id={`option-edit-${index}`}
                            checked={editedQuestion.correctAnswerIndex === index}
                            onChange={() => handleCorrectAnswerChange(index)}
                            className="h-5 w-5 text-cyan-600 bg-slate-700 border-slate-600 focus:ring-cyan-500 shrink-0"
                        />
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition text-base"
                            placeholder={`Seçenek ${index + 1}`}
                        />
                        {editedQuestion.options.length > 2 && ( // Only show remove if more than 2 options
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-full transition-colors shrink-0"
                            title="Seçeneği Sil"
                          >
                            <TrashIcon />
                          </button>
                        )}
                    </div>
                ))}
             </div>
             {editedQuestion.options.length < 5 && ( // Show add button if less than 5 options
                <button
                    type="button"
                    onClick={handleAddOption}
                    className="mt-3 flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium p-2"
                >
                    <AddIcon className="h-4 w-4" />
                    Seçenek Ekle
                </button>
             )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end items-center gap-4 pt-4 pb-4 shrink-0 border-t border-slate-700 mt-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-white">İptal</button>
            <button type="submit" className="px-6 py-2.5 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors text-white">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionModal;
