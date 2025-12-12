
import React, { useState, useEffect } from 'react';
import type { QuizConfigModalProps } from '../types';
import ShuffleIcon from './icons/ShuffleIcon';
import StarIcon from './icons/StarIcon';

const QuizConfigModal: React.FC<QuizConfigModalProps> = ({ topic, onClose, onStartQuiz }) => {
  const [questionCount, setQuestionCount] = useState(topic.questions.length.toString()); // Default to all questions
  const [shuffle, setShuffle] = useState(false);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [error, setError] = useState('');

  const favoriteCount = topic.questions.filter(q => q.isBookmarked).length;

  // Generate question count options in multiples of 5
  const generateQuestionCountOptions = () => {
    // If filtering favorites, total available is favoriteCount, else topic.questions.length
    const total = filterFavorites ? favoriteCount : topic.questions.length;
    
    const options = [];
    for (let i = 5; i <= total; i += 5) {
      options.push(i);
    }
    // Ensure the total count is an option if it's not a multiple of 5, and it's not already there
    if (total > 0 && total % 5 !== 0 && !options.includes(total)) {
      options.push(total);
    }
    if (total > 0 && total < 5 && !options.includes(total)) {
        options.push(total);
    }
    
    // Sort to ensure correct order
    options.sort((a, b) => a - b);
    return options;
  };

  useEffect(() => {
    const totalAvailable = filterFavorites ? favoriteCount : topic.questions.length;
    // If the selected questionCount is no longer valid reset to 'all' or the max available.
    const currentCountNum = parseInt(questionCount, 10);
    
    if (questionCount === 'all' || currentCountNum > totalAvailable || (filterFavorites && favoriteCount > 0)) {
       setQuestionCount(totalAvailable.toString());
    }
  }, [topic.questions.length, questionCount, filterFavorites, favoriteCount]);

  const handleStartQuiz = () => {
    setError('');
    let finalQuestionCount = 0;
    const totalAvailable = filterFavorites ? favoriteCount : topic.questions.length;

    if (questionCount === 'all' || questionCount === totalAvailable.toString()) { 
      finalQuestionCount = totalAvailable;
    } else {
      finalQuestionCount = parseInt(questionCount, 10);
      if (isNaN(finalQuestionCount) || finalQuestionCount <= 0 || finalQuestionCount > totalAvailable) {
        setError(`Lütfen 1 ile ${totalAvailable} arasında geçerli bir soru adedi girin.`);
        return;
      }
    }

    if (finalQuestionCount === 0) {
        setError(filterFavorites ? 'Bu konuda favori soru bulunmuyor.' : 'Bu konuda hiç soru bulunmuyor.');
        return;
    }

    onClose(); 
    setTimeout(() => { 
      onStartQuiz(topic, {
        questionCount: finalQuestionCount,
        shuffle,
        showHints: true, 
        filterFavorites
      });
    }, 0); 
  };

  const questionCountOptions = generateQuestionCountOptions();

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[70] animate-fade-in" 
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl p-5 w-full max-w-sm shadow-2xl relative flex flex-col max-h-[85vh] h-auto" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 shrink-0">Test Ayarları</h2>
        <p className="text-slate-300 mb-6">
          <span className="font-semibold text-white">{topic.name}</span> konusu için test ayarlarını belirleyin. (Toplam: {topic.questions.length} soru)
        </p>

        <div className="space-y-5 overflow-y-auto pr-2 min-h-0"> 
          <div>
            <label htmlFor="question-count" className="block text-sm font-medium text-slate-300 mb-2">
              Çözülecek Soru Adedi
            </label>
            <select
              id="question-count"
              value={questionCount}
              onChange={(e) => {
                setQuestionCount(e.target.value);
                setError(''); // Clear error on change
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition text-white"
            >
              <option value={(filterFavorites ? favoriteCount : topic.questions.length).toString()}>
                Tüm {filterFavorites ? 'Favori ' : ''}Sorular ({filterFavorites ? favoriteCount : topic.questions.length})
              </option>
              {questionCountOptions.map((num) => (
                <option key={num} value={num}>
                  {num} Soru
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-4 py-2 border-t border-slate-700">
            {/* Shuffle Option */}
            <div className="flex items-center justify-between">
                <label htmlFor="shuffle-toggle" className="text-sm font-medium text-slate-300 cursor-pointer flex items-center gap-2">
                <ShuffleIcon isActive={shuffle} /> Soruları Karıştır
                </label>
                <label htmlFor="shuffle-toggle" className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    id="shuffle-toggle"
                    className="sr-only peer"
                    checked={shuffle}
                    onChange={() => setShuffle(prev => !prev)}
                />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
            </div>

            {/* Favorite Filter Option */}
            <div className={`flex items-center justify-between ${favoriteCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <label htmlFor="favorites-toggle" className={`text-sm font-medium text-slate-300 flex items-center gap-2 ${favoriteCount === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    <StarIcon isFavorite={filterFavorites} /> 
                    <span>Sadece Favori Sorular <span className="text-xs text-slate-500">({favoriteCount})</span></span>
                </label>
                <label htmlFor="favorites-toggle" className={`relative inline-flex items-center ${favoriteCount === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                    type="checkbox"
                    id="favorites-toggle"
                    className="sr-only peer"
                    checked={filterFavorites}
                    disabled={favoriteCount === 0}
                    onChange={() => setFilterFavorites(prev => !prev)}
                />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-yellow-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
            </div>
          </div>
        </div>
        
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <div className="flex justify-end gap-4 pt-4 mt-2 shrink-0"> 
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
          <button type="button" onClick={handleStartQuiz} className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Testi Başlat</button>
        </div>
      </div>
    </div>
  );
};

export default QuizConfigModal;
