
import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { FlashcardsViewProps, Flashcard, FlashcardSRS } from '../types';
import { Topic } from '../types';
import IncorrectIcon from './icons/IncorrectIcon';
import CorrectIcon from './icons/CorrectIcon';
import ThreeDotsIcon from './icons/ThreeDotsIcon';
import EditFlashcardModal from './EditFlashcardModal';
import AddIcon from './icons/AddIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import StarIcon from './icons/StarIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

// Add CSS for the animations
const cardStyles = `
  .flashcard-container {
    perspective: 1000px;
    position: relative;
    width: 100%;
    height: 100%;
    user-select: none;
  }

  .flashcard {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.5s ease-in-out;
    cursor: pointer;
  }

  .flashcard.flipped {
    transform: rotateY(180deg);
  }

  .flashcard-front, .flashcard-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    border-radius: 1.5rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    text-align: center;
    color: #e2e8f0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden; /* Ensure content stays inside border radius */
  }

  .flashcard-back {
    transform: rotateY(180deg);
    justify-content: space-around;
  }

  /* Rich Text Styles for Flashcards */
  .flashcard-text {
    width: 100%;
    overflow-y: auto;
    max-height: 100%;
    /* Scrollbar styling for webkit */
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.3) transparent;
  }
  .flashcard-text::-webkit-scrollbar {
    width: 4px;
  }
  .flashcard-text::-webkit-scrollbar-thumb {
    background-color: rgba(255,255,255,0.3);
    border-radius: 2px;
  }

  .flashcard-text p {
    margin-bottom: 0.5em;
  }
  .flashcard-text p:last-child {
    margin-bottom: 0;
  }
  .flashcard-text strong, .flashcard-text b {
    font-weight: 700;
    color: inherit;
  }
  .flashcard-text ul, .flashcard-text ol {
    padding-left: 1.25em;
    margin-bottom: 0.5em;
    text-align: left;
    display: inline-block;
  }
  .flashcard-text ul { list-style-type: disc; }
  .flashcard-text ol { list-style-type: decimal; }

  /* Front specific typography */
  .flashcard-front .flashcard-text {
    font-size: 1.25rem;
    line-height: 1.5;
    font-weight: 600;
    color: #f8fafc;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* Back specific typography */
  .flashcard-back .flashcard-text-main {
    font-size: 1.1rem;
    line-height: 1.6;
    font-weight: 500;
    color: #ffffff;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .flashcard-back .flashcard-text-preview {
    font-size: 0.85rem;
    color: #94a3b8;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    opacity: 0.9;
    max-height: 25%; /* Limit preview height */
    overflow: hidden;
    flex-shrink: 0;
    width: 100%;
  }
`;

const cardColors = [
  'bg-slate-800',
  'bg-sky-900/80',
  'bg-amber-900/80',
  'bg-emerald-900/80',
  'bg-rose-900/80',
  'bg-violet-900/80',
];

// SM-2 Algorithm helper
const calculateSm2 = (card: Flashcard, grade: number): FlashcardSRS => {
    // Grade: 0-2 (Fail), 3 (Hard), 4 (Good), 5 (Easy)
    
    let { interval, repetition, efactor } = card.srs || { interval: 0, repetition: 0, efactor: 2.5 };

    if (grade >= 3) {
        if (repetition === 0) {
            interval = 1;
        } else if (repetition === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * efactor);
        }
        repetition++;
        // SM-2 formula for E-Factor
        efactor = efactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
        if (efactor < 1.3) efactor = 1.3;
    } else {
        repetition = 0;
        interval = 1; // Start over
    }

    return {
        interval,
        repetition,
        efactor,
        dueDate: Date.now() + (interval * 24 * 60 * 60 * 1000)
    };
};

const formatInterval = (days: number) => {
    if (days === 1) return '1 gün';
    if (days < 30) return `${days} gün`;
    if (days < 365) return `${Math.round(days/30)} ay`;
    return `${Math.round(days/365)} yıl`;
};


const FlashcardsView: React.FC<FlashcardsViewProps> = ({ 
  onBack, 
  topics, 
  isMobileLayout, 
  onEditFlashcard, 
  onDeleteFlashcard, 
  onAddNewTopic,
  onOpenEditTopicModal,
  onDeleteTopic,
  onToggleFavorite,
  availableIcons,
  onOpenBulkAddModal,
  onOpenManageCardsModal,
  onUpdateFlashcardSRS
}) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [studyDeck, setStudyDeck] = useState<Flashcard[]>([]);
  const [browseIndex, setBrowseIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studyMode, setStudyMode] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = cardStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (selectedTopic) {
        // Find the latest version of the topic from the main topics array
        const currentTopicState = topics.find(t => t.id === selectedTopic.id);
        if (currentTopicState) {
            setDeck(currentTopicState.flashcards);
            
            // Organize Study Deck: Due Cards -> New Cards -> Future Cards
            const now = Date.now();
            const due = currentTopicState.flashcards.filter(c => c.srs && c.srs.dueDate <= now);
            const newCards = currentTopicState.flashcards.filter(c => !c.srs);
            const future = currentTopicState.flashcards.filter(c => c.srs && c.srs.dueDate > now).sort((a,b) => (a.srs!.dueDate - b.srs!.dueDate));
            
            setStudyDeck([...due, ...newCards, ...future]);
            setBrowseIndex(0);
        }
        setIsFlipped(false);
    }
  }, [selectedTopic, topics]);
  
   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBackToTopicSelection = () => {
    setSelectedTopic(null);
  };

  const handleRateCard = (grade: number) => {
      if (studyDeck.length === 0 || !selectedTopic) return;
      
      const currentCard = studyDeck[0];
      const newSRS = calculateSm2(currentCard, grade);
      
      // Update data in global state
      onUpdateFlashcardSRS(selectedTopic.id, currentCard.id, newSRS);

      // Move card based on logic
      setStudyDeck(prev => {
          const rest = prev.slice(1);
          // If graded 'Again' (grade 1), re-queue it at the end of the session to review again today
          if (grade < 3) {
              return [...rest, currentCard]; 
          }
          // If correct, remove from session
          return rest;
      });
      setIsFlipped(false);
  };
  
  const handleBrowse = (direction: 'next' | 'prev') => {
    if(deck.length === 0) return;
    setIsFlipped(false);
    setBrowseIndex(prev => {
        if (direction === 'next') {
            return (prev + 1) % deck.length;
        } else {
            return (prev - 1 + deck.length) % deck.length;
        }
    });
  };
  
  const currentCard = studyMode ? studyDeck[0] : deck[browseIndex];

  const handleDelete = () => {
    setIsMenuOpen(false);
    if (selectedTopic && currentCard) {
      if (window.confirm("Bu bilgi kartını kalıcı olarak silmek istediğinizden emin misiniz?")) {
        onDeleteFlashcard(selectedTopic.id, currentCard.id);
      }
    }
  };
  
  const handleSaveEdit = (updatedCard: Omit<Flashcard, 'id'>) => {
    if (selectedTopic && currentCard) {
      onEditFlashcard(selectedTopic.id, currentCard.id, updatedCard);
      setIsEditModalOpen(false);
    }
  };


  const sortedTopics = useMemo(() => {
    return [...topics].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name, 'tr');
    });
  }, [topics]);

  if (!selectedTopic) {
    return (
      <div className="relative text-center w-full animate-fade-in">
        <button onClick={onBack} aria-label="Ana menüye geri dön" className="absolute top-0 left-0 text-slate-300 hover:text-white transition-colors duration-200 z-10 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-8">Bilgi Kartları</h2>
        <div className={`grid ${isMobileLayout ? 'grid-cols-1' : 'md:grid-cols-3'} gap-6`}>
          {sortedTopics.map((topic, index) => {
              const iconComponent = availableIcons.find(icon => icon.name === topic.iconName)?.component;
              const dueCount = topic.flashcards.filter(c => !c.srs || c.srs.dueDate <= Date.now()).length;
              
              return (
              <div key={topic.id} className="relative group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <div
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full h-48 flex flex-col items-center justify-center p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white/10 hover:bg-white/20 cursor-pointer focus:outline-none focus:ring-4 focus:ring-cyan-500/50`}
                  >
                    <div className={`p-3 rounded-full mb-3 transition-transform duration-300 group-hover:scale-110 ${topic.color} relative`}>
                        {iconComponent}
                        {dueCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border border-slate-800">
                                {dueCount}
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg text-center font-semibold text-white">{topic.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{topic.flashcards.length} Kart</p>
                  </div>
                  
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(topic.id); }}
                        aria-label={topic.isFavorite ? `${topic.name} konusunu favorilerden kaldır` : `${topic.name} konusunu favorilere ekle`}
                        title={topic.isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}
                        className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-amber-400 transition-colors duration-200"
                    >
                        <StarIcon />
                    </button>
                  </div>

                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); onOpenEditTopicModal(topic); }}
                        aria-label={`${topic.name} konusunu düzenle`}
                        title="Konuyu Düzenle"
                        className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-amber-400 transition-colors duration-200"
                    >
                        <EditIcon />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDeleteTopic(topic.id); }}
                        aria-label={`${topic.name} konusunu sil`}
                        title="Konuyu Sil"
                        className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-red-400 transition-colors duration-200"
                    >
                        <TrashIcon />
                    </button>
                  </div>
              </div>
          )})}
          <div className="animate-fade-in" style={{ animationDelay: `${sortedTopics.length * 50}ms` }}>
            <button
              onClick={onAddNewTopic}
              aria-label="Yeni konu ekle"
              className="w-full h-48 flex flex-col items-center justify-center p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-2 border-dashed border-slate-700 hover:border-cyan-400 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 text-slate-400 hover:text-cyan-400"
            >
              <AddIcon className="h-12 w-12 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate intervals for the buttons based on the current card
  let btnIntervals = { again: '1 dk', hard: '1 gün', good: '1 gün', easy: '4 gün' };
  if (currentCard) {
      // Simulate next intervals without saving
      const s1 = calculateSm2({...currentCard}, 1);
      const s3 = calculateSm2({...currentCard}, 3);
      const s4 = calculateSm2({...currentCard}, 4);
      const s5 = calculateSm2({...currentCard}, 5);
      
      btnIntervals = {
          again: '1 dk', // Fail always resets to short term
          hard: formatInterval(s3.interval),
          good: formatInterval(s4.interval),
          easy: formatInterval(s5.interval)
      };
  }

  return (
    <div className="flex flex-col items-center justify-between w-full h-[90vh] min-h-[600px] animate-fade-in">
      <div className="w-full flex justify-between items-center text-white relative">
        <button onClick={handleBackToTopicSelection} className="text-slate-300 hover:text-white transition-colors duration-200 z-10 p-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span>Konular</span>
        </button>
        <h2 className="text-2xl font-bold text-center px-2 truncate">{selectedTopic.name}</h2>
        <div className="min-w-[120px] text-right text-slate-300 flex items-center justify-end gap-2">
             <span className="text-sm">{studyMode ? `${studyDeck.length} Kart Kaldı` : `${browseIndex + 1} / ${deck.length}`}</span>
            <div className="relative" ref={menuRef}>
                <button onClick={() => setIsMenuOpen(p => !p)} className="p-2 rounded-full hover:bg-white/20">
                    <ThreeDotsIcon />
                </button>
                {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-20 animate-fade-in">
                    <button onClick={() => { onOpenManageCardsModal(selectedTopic); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded-t-md border-b border-slate-700">Kartları Yönet</button>
                    <button onClick={() => { onOpenBulkAddModal(selectedTopic); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700">Toplu Kart Ekle</button>
                    <button onClick={() => { setIsEditModalOpen(true); setIsMenuOpen(false); }} disabled={!currentCard} className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed">Kartı Düzenle</button>
                    <button onClick={handleDelete} disabled={!currentCard} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-b-md disabled:text-slate-500 disabled:cursor-not-allowed">Kartı Sil</button>
                </div>
                )}
            </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center gap-4 my-2">
          <label htmlFor="study-mode-toggle" className="text-slate-300 font-medium cursor-pointer text-sm">Göz At</label>
          <label htmlFor="study-mode-toggle" className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="study-mode-toggle" className="sr-only peer" checked={studyMode} onChange={() => setStudyMode(p => !p)} />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-500/50 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
          </label>
          <label htmlFor="study-mode-toggle" className="text-slate-300 font-medium cursor-pointer text-sm">Aralıklı Tekrar</label>
      </div>

      <div className="w-full max-w-lg h-96 flex-grow flex items-center justify-center relative">
        {currentCard ? (
          <div className="flashcard-container">
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`flashcard-front ${cardColors[0]}`}>
                <div 
                    className="flashcard-text" 
                    dangerouslySetInnerHTML={{ __html: currentCard.front }}
                />
                {!isFlipped && studyMode && (
                    <div className="absolute bottom-4 text-xs text-slate-400 animate-pulse">Cevabı görmek için dokun</div>
                )}
              </div>
              <div className={`flashcard-back ${cardColors[0]}`}>
                <div 
                    className="flashcard-text flashcard-text-preview" 
                    dangerouslySetInnerHTML={{ __html: currentCard.front }}
                />
                <div 
                    className="flashcard-text flashcard-text-main" 
                    dangerouslySetInnerHTML={{ __html: currentCard.back }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-white p-8 bg-white/10 rounded-xl">
            <h3 className="text-3xl font-bold mb-2">Harika iş!</h3>
            <p className="text-slate-300">{studyMode ? 'Bu konudaki çalışma sırası gelen tüm kartları tamamladın.' : 'Bu konuda hiç kart yok.'}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center justify-center mt-4 w-full px-2 min-h-[80px]">
        {studyMode ? (
          isFlipped && currentCard ? (
            <div className="grid grid-cols-4 gap-2 w-full max-w-lg">
                <button onClick={(e) => { e.stopPropagation(); handleRateCard(1); }} className="flex flex-col items-center justify-center p-2 rounded-lg bg-red-900/80 hover:bg-red-800 border border-red-700/50 transition-colors">
                    <span className="text-sm font-bold text-red-200">Tekrar</span>
                    <span className="text-xs text-red-400">{btnIntervals.again}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleRateCard(3); }} className="flex flex-col items-center justify-center p-2 rounded-lg bg-orange-900/80 hover:bg-orange-800 border border-orange-700/50 transition-colors">
                    <span className="text-sm font-bold text-orange-200">Zor</span>
                    <span className="text-xs text-orange-400">{btnIntervals.hard}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleRateCard(4); }} className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-900/80 hover:bg-blue-800 border border-blue-700/50 transition-colors">
                    <span className="text-sm font-bold text-blue-200">İyi</span>
                    <span className="text-xs text-blue-400">{btnIntervals.good}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleRateCard(5); }} className="flex flex-col items-center justify-center p-2 rounded-lg bg-green-900/80 hover:bg-green-800 border border-green-700/50 transition-colors">
                    <span className="text-sm font-bold text-green-200">Kolay</span>
                    <span className="text-xs text-green-400">{btnIntervals.easy}</span>
                </button>
            </div>
          ) : (
             currentCard && (
                <button onClick={() => setIsFlipped(true)} className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-full font-semibold text-white shadow-lg transition-colors w-full max-w-xs">
                    Cevabı Göster
                </button>
             )
          )
        ) : (
          <>
            <button onClick={() => handleBrowse('prev')} disabled={!currentCard} className="w-16 h-16 flex items-center justify-center bg-slate-700/80 rounded-full text-white shadow-lg hover:bg-slate-600 disabled:opacity-50 transition-all transform hover:scale-110">
              <ChevronLeftIcon />
            </button>
            <button onClick={() => handleBrowse('next')} disabled={!currentCard} className="w-16 h-16 flex items-center justify-center bg-slate-700/80 rounded-full text-white shadow-lg hover:bg-slate-600 disabled:opacity-50 transition-all transform hover:scale-110">
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>

      {isEditModalOpen && currentCard && (
        <EditFlashcardModal card={currentCard} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveEdit} />
      )}
    </div>
  );
};

export default FlashcardsView;
