import React, { useState, useEffect } from 'react';
import type { Question } from '../types';

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
    setError(''); // Clear error on new question load
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!editedQuestion.questionText.trim()) {
      setError('Soru metni boş olamaz.');
      return;
    }
    if (editedQuestion.options.some(opt => !opt.trim())) {
      setError('Tüm seçenekler doldurulmalıdır.');
      return;
    }
    if (editedQuestion.correctAnswerIndex === null || editedQuestion.correctAnswerIndex < 0 || editedQuestion.correctAnswerIndex >= editedQuestion.options.length) {
        setError('Doğru cevap seçilmelidir.');
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
                    </div>
                ))}
             </div>
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