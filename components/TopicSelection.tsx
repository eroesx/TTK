import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { TopicSelectionProps } from '../types';
import AddIcon from './icons/AddIcon';
import ViewIcon from './icons/ViewIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import StarIcon from './icons/StarIcon';
import SearchIcon from './icons/SearchIcon';
import ShuffleIcon from './icons/ShuffleIcon';
import SortIcon from './icons/SortIcon';
import SyncIcon from './icons/SyncIcon';
import LightbulbIcon from './icons/LightbulbIcon';

type SortOrder = 'recommended' | 'alpha-asc' | 'alpha-desc' | 'q-desc' | 'q-asc';

const sortOptions: { key: SortOrder; label: string }[] = [
    { key: 'recommended', label: 'Önerilen Sıralama' },
    { key: 'alpha-asc', label: 'Alfabetik (A-Z)' },
    { key: 'alpha-desc', label: 'Alfabetik (Z-A)' },
    { key: 'q-desc', label: 'Soru Sayısı (Çoktan Aza)' },
    { key: 'q-asc', label: 'Soru Sayısı (Azdan çoğa)' },
];

const TopicSelection: React.FC<TopicSelectionProps> = ({ 
  topics, 
  onSelectTopic, 
  onBack, 
  onOpenAddQuestionModal, 
  onOpenViewQuestionsModal, 
  onOpenEditTopicModal, 
  onDeleteTopic, 
  onAddNewTopic, 
  onToggleFavorite, 
  availableIcons,
  isMobileLayout,
  onSyncData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [shuffledTopics, setShuffledTopics] = useState<Set<string>>(new Set());
  const [hintEnabledTopics, setHintEnabledTopics] = useState<Set<string>>(new Set());
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    return (localStorage.getItem('topicSortOrder') as SortOrder) || 'recommended';
  });
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('topicSortOrder', sortOrder);
  }, [sortOrder]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchVisible) {
      searchInputRef.current?.focus();
    }
  }, [isSearchVisible]);

  const toggleShuffle = (topicId: string) => {
    setShuffledTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  };
  
  const toggleHints = (topicId: string) => {
    setHintEnabledTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  };

  const sortedTopics = useMemo(() => {
    const filtered = topics.filter(topic =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOrder) {
      case 'alpha-asc':
        return filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      case 'alpha-desc':
        return filtered.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
      case 'q-desc':
        return filtered.sort((a, b) => b.questions.length - a.questions.length);
      case 'q-asc':
        return filtered.sort((a, b) => a.questions.length - b.questions.length);
      case 'recommended':
      default:
        return filtered.sort((a, b) => {
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return a.name.localeCompare(b.name, 'tr');
        });
    }
  }, [topics, searchTerm, sortOrder]);


  return (
    <div className="relative text-center w-full animate-fade-in">
        <button onClick={onBack} aria-label="Ana menüye geri dön" className="absolute top-0 left-0 text-slate-400 hover:text-white transition-colors duration-200 z-10 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>

       <div className="mb-8">
        <div className="flex justify-center items-center gap-2">
            <h2 className={`text-4xl ${isMobileLayout ? '' : 'md:text-5xl'} font-extrabold text-white tracking-tight`}>
                Bir Konu Seç
            </h2>
            <button
                onClick={() => setIsSearchVisible(prev => !prev)}
                aria-label="Konu arama çubuğunu aç"
                title="Konu Ara"
                className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors duration-200"
            >
                <SearchIcon />
            </button>
            <div className="relative" ref={sortMenuRef}>
                <button
                    onClick={() => setIsSortMenuOpen(prev => !prev)}
                    aria-label="Sıralama seçeneklerini aç"
                    title="Sırala"
                    className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors duration-200"
                >
                    <SortIcon />
                </button>
                {isSortMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-20 animate-fade-in">
                        <div className="p-2">
                            {sortOptions.map(option => (
                                <button
                                    key={option.key}
                                    onClick={() => {
                                        setSortOrder(option.key);
                                        setIsSortMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                        sortOrder === option.key ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <button
                onClick={onSyncData}
                aria-label="Soru bankasını en güncel haline getir"
                title="Soru Bankasını Güncelle"
                className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors duration-200"
            >
                <SyncIcon />
            </button>
        </div>
      </div>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSearchVisible ? 'max-h-40 mb-8' : 'max-h-0'}`}>
        <div className="w-full max-w-md mx-auto">
            <input
            ref={searchInputRef}
            type="text"
            placeholder="Konu ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Konu ara"
            className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
            />
        </div>
      </div>


      <div className={`grid ${isMobileLayout ? 'grid-cols-1' : 'md:grid-cols-3'} gap-6`}>
        {sortedTopics.length > 0 ? (
          sortedTopics.map((topic, index) => {
            const iconComponent = availableIcons.find(icon => icon.name === topic.iconName)?.component;
            const isShuffled = shuffledTopics.has(topic.id);
            const areHintsEnabled = hintEnabledTopics.has(topic.id);

            return (
            <div key={topic.id} className="relative group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div
                onClick={() => onSelectTopic(topic, { shuffle: isShuffled, showHints: areHintsEnabled })}
                className={`w-full h-48 cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${topic.bgColor} bg-opacity-80 border-2 border-slate-700/50 hover:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50`}
              >
                <div className={`p-3 rounded-full mb-3 transition-transform duration-300 group-hover:scale-110 ${topic.color}`}>
                  {iconComponent}
                </div>
                <h3 className="text-lg text-center font-semibold text-white">{topic.name}</h3>
                <p className="text-slate-400 text-sm mt-1">{topic.questions.length} Soru</p>
              </div>
              
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(topic.id); }}
                  aria-label={topic.isFavorite ? `${topic.name} konusunu favorilerden kaldır` : `${topic.name} konusunu favorilere ekle`}
                  title={topic.isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}
                  className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-amber-400 transition-colors duration-200"
                >
                  <StarIcon isFavorite={topic.isFavorite} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenViewQuestionsModal(topic); }}
                  aria-label={`${topic.name} konusundaki soruları gör`}
                  title="Soruları Gör"
                  className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-violet-400 transition-colors duration-200"
                > <ViewIcon /> </button>
              </div>

              <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenAddQuestionModal(topic); }}
                  aria-label={`${topic.name} konusuna soru ekle`}
                  title="Soru Ekle"
                  className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                > <AddIcon /> </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenEditTopicModal(topic); }}
                  aria-label={`${topic.name} konusunu düzenle`}
                  title="Konuyu Düzenle"
                  className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-amber-400 transition-colors duration-200"
                > <EditIcon /> </button>
              </div>
               <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleShuffle(topic.id); }}
                  aria-label={`${topic.name} konusu için soruları karıştır`}
                  title="Soruları Karıştır"
                  className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 transition-colors duration-200"
                >
                  <ShuffleIcon isActive={isShuffled} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleHints(topic.id); }}
                  aria-label={`${topic.name} konusu için ipuçlarını göster`}
                  title="İpuçlarını Göster"
                  className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 transition-colors duration-200"
                >
                  <LightbulbIcon isActive={areHintsEnabled} />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <button
                  onClick={(e) => { e.stopPropagation(); onDeleteTopic(topic.id); }}
                  aria-label={`${topic.name} konusunu sil`}
                  title="Konuyu Sil"
                  className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-red-400 transition-colors duration-200"
                > <TrashIcon /> </button>
              </div>
            </div>
          )})
        ) : (
          !searchTerm && (
            <p className="col-span-full text-slate-400 text-lg py-8">
              Henüz bir konu bulunmuyor.
            </p>
          )
        )}
         {searchTerm && sortedTopics.length === 0 && (
             <p className="col-span-full text-slate-400 text-lg py-8">
                "{searchTerm}" ile eşleşen bir konu bulunamadı.
            </p>
        )}
        <div className="animate-fade-in" style={{ animationDelay: `${sortedTopics.length * 50}ms` }}>
            <button
            onClick={onAddNewTopic}
            aria-label="Yeni konu ekle"
            className="w-full h-48 flex flex-col items-center justify-center p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-2 border-dashed border-slate-700 hover:border-cyan-400 hover:bg-slate-800/50 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 text-slate-400 hover:text-cyan-400"
            >
                <AddIcon className="h-12 w-12 transition-colors" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;