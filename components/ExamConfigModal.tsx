
import React, { useState } from 'react';
import type { ExamConfigModalProps } from '../types';
import PenPaperIcon from './icons/PenPaperIcon';

const ExamConfigModal: React.FC<ExamConfigModalProps> = ({ totalAvailableQuestions, onClose, onStartExam }) => {
  const [questionCount, setQuestionCount] = useState(20);
  const [duration, setDuration] = useState(20);

  const handleStart = () => {
    onStartExam({ questionCount, duration });
  };

  // Limit question count to max available
  const maxQuestions = Math.min(100, totalAvailableQuestions);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[70] animate-fade-in" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative flex flex-col" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-violet-500/20 rounded-lg">
                <PenPaperIcon className="h-6 w-6 text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-violet-400">Deneme Sınavı</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Soru Sayısı: <span className="text-white font-bold">{questionCount}</span>
            </label>
            <input 
              type="range" 
              min="10" 
              max={maxQuestions} 
              step="5"
              value={questionCount} 
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>10</span>
              <span>{maxQuestions}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Süre (Dakika): <span className="text-white font-bold">{duration} dk</span>
            </label>
            <input 
              type="range" 
              min="5" 
              max="120" 
              step="5"
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>5 dk</span>
              <span>120 dk</span>
            </div>
          </div>
          
          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-sm text-slate-400">
            <p>Bu modda:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Sorular tüm konulardan karışık gelir.</li>
                <li>Sınav bitene kadar doğru/yanlış gösterilmez.</li>
                <li>Süre dolduğunda sınav otomatik biter.</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-white">İptal</button>
          <button onClick={handleStart} className="px-6 py-2 rounded-md bg-violet-600 hover:bg-violet-500 font-bold transition-colors text-white shadow-lg shadow-violet-900/20">
            Sınavı Başlat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamConfigModal;
