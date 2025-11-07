import React from 'react';
import type { ResultsViewProps } from '../types';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';


const ResultsView: React.FC<ResultsViewProps> = ({ score, totalQuestions, onBackToTopics, onBackToHome, isMobileLayout, previousScore }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  
  let message = '';
  if (percentage === 100) {
    message = 'Harika! Tüm soruları doğru bildin!';
  } else if (percentage >= 75) {
    message = 'Çok iyi iş! Neredeyse mükemmel!';
  } else if (percentage >= 50) {
    message = 'İyi deneme! Biraz daha pratikle daha iyisini yapabilirsin.';
  } else {
    message = 'Tekrar denemekten çekinme!';
  }

  const scoreDifference = previousScore !== undefined ? percentage - previousScore : undefined;

  return (
    <div className="flex flex-col items-center justify-center bg-slate-800/50 p-8 rounded-2xl shadow-2xl text-center animate-fade-in">
      <h2 className="text-4xl font-bold text-cyan-400 mb-4">Test Sonucu</h2>
      <p className="text-xl text-slate-300 mb-6">{message}</p>
      
      <div className={`relative ${isMobileLayout ? 'w-40 h-40' : 'w-48 h-48'} flex items-center justify-center mb-8`}>
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-slate-700"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="text-cyan-400"
            strokeDasharray={`${percentage}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
            <span className={`font-bold text-white ${isMobileLayout ? 'text-4xl' : 'text-5xl'}`}>{percentage}%</span>
            <span className="text-slate-400">Doğru</span>
        </div>
      </div>

      <p className={`text-lg text-slate-300 ${previousScore !== undefined ? 'mb-2' : 'mb-8'}`}>
        Toplam <strong className="text-white">{totalQuestions}</strong> sorudan <strong className="text-white">{score}</strong> tanesini doğru cevapladın.
      </p>

      {previousScore !== undefined && (
        <div className="mb-8 flex items-center justify-center gap-3 text-md text-slate-400 animate-fade-in">
          <span>Önceki Sonuç: <strong className="text-white">{previousScore}%</strong></span>
          {scoreDifference !== undefined && scoreDifference !== 0 && (
            <div className={`flex items-center gap-1 font-bold ${scoreDifference > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {scoreDifference > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              <span>{Math.abs(scoreDifference)}%</span>
            </div>
          )}
        </div>
      )}
      
      <div className={`flex ${isMobileLayout ? 'flex-col w-full' : 'sm:flex-row'} gap-4`}>
        <button
          onClick={onBackToTopics}
          className="px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-500 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
        >
          Başka Test Çöz
        </button>
        <button
          onClick={onBackToHome}
          className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-500 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
        >
          Ana Menüye Dön
        </button>
      </div>
    </div>
  );
};

export default ResultsView;