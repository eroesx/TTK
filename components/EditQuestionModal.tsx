
import React, { useState, useEffect } from 'react';
import type { Question } from '../types';
import TrashIcon from './icons/TrashIcon';
import AddIcon from './icons/AddIcon';

interface EditQuestionModalProps {
  question: Question;
  onSave: (updatedQuestion: Question) => void;
  onClose: () => void;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({ question, onSave, onClose }) => {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);
  const [error, setError] = useState('');

  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedQuestion({ ...editedQuestion, questionText: e.target.value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editedQuestion.options];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  const handleCorrectAnswerChange = (index: number) => {
    setEditedQuestion({ ...editedQuestion, correctAnswerIndex: index });
  };

  const handleAddOption = () => {
    if (editedQuestion.options.length < 5) {
      setEditedQuestion({
        ...editedQuestion,
        options: [...editedQuestion.options, '']
      });
    }
  };

  const handleRemoveOption = (indexToRemove: number) => {
    if (editedQuestion.options.length <= 2) return;

    const newOptions = editedQuestion.options.filter((_, i) => i !== indexToRemove);
    let newCorrectIndex = editedQuestion.correctAnswerIndex;

    // Reset correct answer if it's the one being removed
    // Shift index if removed option was before correct answer
    if (newCorrectIndex === indexToRemove) {
      // Invalidate logic: set to 0 as default or stay invalid? Let's default to 0 to avoid errors, user must check.
      // Better: check on save.
      newCorrectIndex = 0; 
    } else if (newCorrectIndex > indexToRemove) {
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
    if (!editedQuestion.questionText.trim()) {
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
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl p-8 w-full max-w-3xl shadow-2xl relative max-h-[90vh] flex flex-col border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 shrink-0">
          Soruyu Düzenle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-4 -mr-4">
          <div>
            <label htmlFor="questionText" className="block text-sm font-medium text-slate-300 mb-2">Soru Metni</label>
            <textarea
              id="questionText"
              value={editedQuestion.questionText}
              onChange={handleTextChange}
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              placeholder="Soruyu buraya yazın..."
            />
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
                            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                            placeholder={`Seçenek ${index + 1}`}
                        />
                        {editedQuestion.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                            title="Seçeneği Sil"
                          >
                            <TrashIcon />
                          </button>
                        )}
                    </div>
                ))}
             </div>
             {editedQuestion.options.length < 5 && (
                <button
                    type="button"
                    onClick={handleAddOption}
                    className="mt-3 flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                    <AddIcon className="h-4 w-4" />
                    Seçenek Ekle
                </button>
             )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-end gap-4 pt-4 shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
            <button type="submit" className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Değişiklikleri Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestionModal;
