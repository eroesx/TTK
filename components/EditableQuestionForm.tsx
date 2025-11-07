import React, { useState, useEffect } from 'react';
import type { Question } from '../types';
import TrashIcon from './icons/TrashIcon';

interface EditableQuestionFormProps {
  question: Question;
  onSave: (updatedQuestion: Question) => void;
  onDelete: () => void;
}

const EditableQuestionForm: React.FC<EditableQuestionFormProps> = ({ question, onSave, onDelete }) => {
  const [questionText, setQuestionText] = useState(question.questionText);
  const [options, setOptions] = useState([...question.options]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(question.correctAnswerIndex);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setQuestionText(question.questionText);
    setOptions([...question.options]);
    setCorrectAnswerIndex(question.correctAnswerIndex);
    setIsDirty(false);
  }, [question]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    setIsDirty(true);
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionText(e.target.value);
    setIsDirty(true);
  }
  
  const handleCorrectAnswerChange = (index: number) => {
    setCorrectAnswerIndex(index);
    setIsDirty(true);
  }

  const handleSave = () => {
    if (!questionText.trim() || options.some(opt => !opt.trim())) {
        alert("Soru metni ve tüm seçenekler doldurulmalıdır.");
        return;
    }
    const updatedQuestion: Question = {
      ...question,
      questionText,
      options,
      correctAnswerIndex,
    };
    onSave(updatedQuestion);
    setIsDirty(false);
  };
  
  const handleDelete = () => {
    if (window.confirm("Bu soruyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
        onDelete();
    }
  }

  return (
    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Soru Metni</label>
        <textarea
          value={questionText}
          onChange={handleTextChange}
          rows={3}
          className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Seçenekler</label>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="radio"
                name={`correctAnswer-${question.id}`}
                checked={correctAnswerIndex === index}
                onChange={() => handleCorrectAnswerChange(index)}
                className="h-4 w-4 text-cyan-600 bg-slate-700 border-slate-600 focus:ring-cyan-500 shrink-0"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end items-center gap-3">
        <button 
          onClick={handleDelete}
          className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          title="Soruyu Sil"
        >
          <TrashIcon />
        </button>
        <button 
          onClick={handleSave}
          disabled={!isDirty}
          className="px-5 py-2 rounded-md bg-cyan-600 font-semibold transition-colors enabled:hover:bg-cyan-500 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          Kaydet
        </button>
      </div>
    </div>
  );
};

export default EditableQuestionForm;