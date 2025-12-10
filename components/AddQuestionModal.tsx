
import React, { useState } from 'react';
import type { Topic, Question } from '../types';
import AddIcon from './icons/AddIcon';
import TrashIcon from './icons/TrashIcon';

interface AddQuestionModalProps {
  topic: Topic;
  onClose: () => void;
  onAddQuestion: (topicId: string, newQuestion: Question) => void;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ topic, onClose, onAddQuestion }) => {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']); // Start with 4 options default
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resetForm = () => {
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(null);
    setError('');
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options required

    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);

    // Adjust correct answer index if necessary
    if (correctAnswerIndex === index) {
      setCorrectAnswerIndex(null);
    } else if (correctAnswerIndex !== null && correctAnswerIndex > index) {
      setCorrectAnswerIndex(correctAnswerIndex - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!questionText.trim()) {
      setError('Soru metni boş olamaz.');
      return;
    }
    if (options.some(opt => !opt.trim())) {
      setError('Tüm seçenekler doldurulmalıdır.');
      return;
    }
    if (correctAnswerIndex === null) {
      setError('Doğru cevap seçilmelidir.');
      return;
    }

    const newQuestion: Question = {
      id: Date.now(),
      questionText: questionText.trim(),
      options: options.map(opt => opt.trim()),
      correctAnswerIndex: correctAnswerIndex,
    };

    onAddQuestion(topic.id, newQuestion);
    setSuccessMessage('Soru başarıyla eklendi! Yeni bir soru daha ekleyebilirsiniz.');
    resetForm();
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div 
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60] animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          <span className="text-slate-400 font-normal">Konu:</span> {topic.name}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="questionText" className="block text-sm font-medium text-slate-300 mb-2">Soru Metni</label>
            <textarea
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              placeholder="Soruyu buraya yazın..."
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-300 mb-2">Seçenekler (Doğru olanı işaretleyin)</label>
             <div className="space-y-3">
                {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="correctAnswer"
                            id={`option-${index}`}
                            checked={correctAnswerIndex === index}
                            onChange={() => setCorrectAnswerIndex(index)}
                            className="h-4 w-4 text-cyan-600 bg-slate-700 border-slate-600 focus:ring-cyan-500 shrink-0"
                        />
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                            placeholder={`Seçenek ${index + 1}`}
                        />
                        {options.length > 2 && (
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
             {options.length < 5 && (
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
          
          <div className="min-h-[20px] text-sm text-center">
            {error && <p className="text-red-400">{error}</p>}
            {successMessage && <p className="text-green-400">{successMessage}</p>}
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">Kapat</button>
            <button type="submit" className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Soruyu Ekle</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;
