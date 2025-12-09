
import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { TopicSelectionProps, Topic } from '../types';
import AddIcon from './icons/AddIcon';
import ViewIcon from './icons/ViewIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import StarIcon from './icons/StarIcon';
import SearchIcon from './icons/SearchIcon';
import SortIcon from './icons/SortIcon';
import SyncIcon from './icons/SyncIcon';
// import QuizConfigModal from './QuizConfigModal'; // Moved import to App.tsx as it's rendered there

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
  // Removed shuffledTopics and hintEnabledTopics as these are now managed by QuizConfigModal
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

  // Function to open QuizConfigModal
  const handleTopicClick = (topic: Topic) => {
    // FIX: Pass the expected `options` object with default values.
    // This calls the onSelectTopic prop, which in App.tsx opens the QuizConfigModal
    onSelectTopic(topic, { questionCount: 0, shuffle: false, showHints: false }); // Dummy options, modal will populate
  };

  const sortedTopics = useMemo(() => {
    const filtered = topics.filter(topic =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Primary sort: favorited topics always come first
    return [...filtered].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;

      // Secondary sort: apply the selected sortOrder within favorite/non-favorite groups
      if (sortOrder === 'alpha-asc') {
        return a.name.localeCompare(b.name, 'tr');
      } else if (sortOrder === 'alpha-desc') {
        return b.name.localeCompare(a.name, 'tr');
      } else if (sortOrder === 'q-desc') {
        return b.questions.length - a.questions.length;
      } else if (sortOrder === 'q-asc') {
        return a.questions.length - b.questions.length;
      }
      // Default or 'recommended' for secondary sort: alphabetical
      return a.name.localeCompare(b.name, 'tr');
    });
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
            <h2 className={`text-3xl ${isMobileLayout ? 'text-2xl' : 'md:text-5xl'} font-extrabold text-white tracking-tight`}>
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


      <div className={`grid ${isMobileLayout ? 'grid-cols-1 gap-4' : 'md:grid-cols-3 gap-6'}`}>
        {sortedTopics.length > 0 ? (
          sortedTopics.map((topic, index) => {
            const iconComponent = availableIcons.find(icon => icon.name === topic.iconName)?.component;
            
            return (
            <div key={topic.id} className="relative group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div
                onClick={() => handleTopicClick(topic)}
                className={`
                    w-full cursor-pointer flex rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 
                    ${topic.bgColor} bg-opacity-80 border-2 border-slate-700/50 hover:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50
                    ${isMobileLayout 
                        ? 'flex-row items-center justify-start text-left px-4 py-4 min-h-[5.5rem]' 
                        : 'flex-col items-center justify-center p-6 h-48 text-center'
                    }
                `}
              >
                <div className={`
                    rounded-full transition-transform duration-300 group-hover:scale-110 
                    ${topic.color} 
                    ${isMobileLayout ? 'p-2 mr-4 mb-0 w-12 h-12 flex items-center justify-center shrink-0' : 'p-3 mb-3'}
                `}>
                  {iconComponent}
                </div>
                <div className={`${isMobileLayout ? 'flex-grow pr-16' : ''}`}>
                    <h3 className={`font-semibold text-white leading-tight ${isMobileLayout ? 'text-base mb-1' : 'text-lg'}`}>
                        {topic.name}
                    </h3>
                    <p className={`text-slate-400 ${isMobileLayout ? 'text-xs' : 'text-sm mt-1'}`}>
                        {topic.questions.length} Soru
                    </p>
                </div>
              </div>
              
              {/* Favorite Icon - Left on Desktop, Right on Mobile */}
              <div className={`absolute z-10 transition-opacity duration-300 ${isMobileLayout ? 'top-1/2 -translate-y-1/2 left-auto right-14 opacity-100' : 'top-2 left-2 opacity-0 group-hover:opacity-100'}`}>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(topic.id); }}
                  aria-label={topic.isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}
                  className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-amber-400 transition-colors duration-200"
                >
                  <StarIcon isFavorite={topic.isFavorite} />
                </button>
              </div>

              {/* View Questions Icon - Left on Desktop, Right on Mobile */}
              <div className={`absolute z-10 transition-opacity duration-300 ${isMobileLayout ? 'top-1/2 -translate-y-1/2 left-auto right-4 opacity-100' : 'top-2 left-12 opacity-0 group-hover:opacity-100'}`}>
                 <button
                  onClick={(e) => { e.stopPropagation(); onOpenViewQuestionsModal(topic); }}
                  aria-label="Soruları Gör"
                  className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-violet-400 transition-colors duration-200"
                > <ViewIcon /> </button>
              </div>

              {/* Add & Edit Icons - Top Right on Desktop */}
              <div className={`absolute transition-opacity duration-300 z-10 flex items-center gap-1.5 ${isMobileLayout ? 'opacity-0 pointer-events-none' : 'top-2 right-2 opacity-0 group-hover:opacity-100'}`}>
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenAddQuestionModal(topic); }}
                  title="Soru Ekle"
                  className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                > <AddIcon /> </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenEditTopicModal(topic); }}
                  title="Konuyu Düzenle"
                  className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-amber-400 transition-colors duration-200"
                > <EditIcon /> </button>
              </div>

              {/* Delete Icon - Bottom Right on Desktop, Hidden on Mobile Face (Use Edit/Long Press?) -> For simplicity, keep hidden on mobile or rely on desktop view for admin tasks if screen is too small */}
              {/* To make it accessible on mobile without clutter, we could add it to the row, but requested layout is just 'better'. 
                  Let's keep these admin actions on desktop view mostly, or require a tap to reveal if we implemented a menu. 
                  For now, we hide Add/Edit/Delete on the main mobile card face to keep it clean, users can switch to desktop mode or we assume editing is done on larger screens. 
                  Actually, let's keep them accessible but maybe via the 'View Questions' modal or similar. 
                  But wait, the user might need to edit on mobile. Let's add Edit button to mobile row.
              */}
               
               {isMobileLayout && (
                   // Mobile Specific Actions Container (replaces the desktop ones)
                   // Actually, let's put Edit next to View.
                   <div className="hidden"></div>
               )}

              <div className={`absolute z-10 transition-opacity duration-300 ${isMobileLayout ? 'bottom-1 right-2 opacity-0' : 'bottom-2 right-2 opacity-0 group-hover:opacity-100'}`}>
                 <button
                  onClick={(e) => { e.stopPropagation(); onDeleteTopic(topic.id); }}
                  title="Konuyu Sil"
                  className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-red-400 transition-colors duration-200"
                > <TrashIcon /> </button>
              </div>
              
              {/* Mobile Specific Edit Button (Optional, but good for UX) */}
              {isMobileLayout && (
                  <div className="absolute bottom-1 right-14 z-10 opacity-50">
                        <button
                        onClick={(e) => { e.stopPropagation(); onOpenEditTopicModal(topic); }}
                        className="p-1 text-slate-500 hover:text-amber-400"
                        > <EditIcon /> </button>
                  </div>
              )}

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
            className={`
                w-full flex items-center justify-center rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 
                border-2 border-dashed border-slate-700 hover:border-cyan-400 hover:bg-slate-800/50 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 text-slate-400 hover:text-cyan-400
                ${isMobileLayout ? 'h-auto py-6' : 'h-48 flex-col p-6'}
            `}
            >
                <AddIcon className="h-12 w-12 transition-colors" />
                {isMobileLayout && <span className="ml-2 font-semibold">Yeni Konu Ekle</span>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;
