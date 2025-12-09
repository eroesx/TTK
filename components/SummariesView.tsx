
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { SummariesViewProps, Topic } from '../types';
import EditIcon from './icons/EditIcon';
import AddIcon from './icons/AddIcon';
import TrashIcon from './icons/TrashIcon';
import StarIcon from './icons/StarIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

declare const Quill: any;

const SummariesView: React.FC<SummariesViewProps> = ({
  onBack,
  topics,
  onUpdateSummary,
  onAddNewTopic,
  onOpenEditTopicModal,
  onDeleteTopic,
  onToggleFavorite,
  availableIcons,
  isMobileLayout,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [summaryTheme, setSummaryTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('summaryTheme') as 'light' | 'dark') || 'dark';
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<any>(null);
  const keySequenceRef = useRef<string>('');
  const themeMenuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    localStorage.setItem('summaryTheme', summaryTheme);
  }, [summaryTheme]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeTopic = useMemo(() => {
    return topics.find(t => t.id === selectedTopic?.id) || null;
  }, [topics, selectedTopic]);

  const handleSave = useCallback(() => {
    if (activeTopic && quillInstanceRef.current) {
      const newSummary = quillInstanceRef.current.root.innerHTML;
      onUpdateSummary(activeTopic.id, newSummary);
      setIsEditing(false);
    }
  }, [activeTopic, onUpdateSummary]);

  // Effect to CREATE Quill instance when the editor container is available
  useEffect(() => {
    if (activeTopic && editorContainerRef.current && typeof Quill !== 'undefined' && !quillInstanceRef.current) {
      const editorElement = document.createElement('div');
      editorContainerRef.current.appendChild(editorElement);
      const quill = new Quill(editorElement, {
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['clean']
          ]
        },
        placeholder: 'Konu özetini buraya yazın...',
        theme: 'snow',
      });
      quillInstanceRef.current = quill;
    }
    // Cleanup: destroy Quill instance when component unmounts or topic changes
    return () => {
      if (quillInstanceRef.current && typeof quillInstanceRef.current.destroy === 'function') {
        quillInstanceRef.current.destroy();
      }
      quillInstanceRef.current = null;
      if (editorContainerRef.current) {
        editorContainerRef.current.innerHTML = ''; // Clear container on unmount
      }
    };
  }, [activeTopic]); // Depend on activeTopic so it re-runs when entering detailed view

  // Effect to manage visibility, content, and state of the EXISTING Quill instance.
  useEffect(() => {
    const quill = quillInstanceRef.current;
    if (!quill) return; // Only proceed if Quill instance exists

    const editorParent = editorContainerRef.current;
    if (!editorParent) return;

    if (isEditing) {
      // Set content and make visible
      // Only set content if it's vastly different to avoid cursor jumps, or if we just entered edit mode
      if (quill.root.innerHTML !== (activeTopic?.summary || '')) {
         quill.root.innerHTML = activeTopic?.summary || '';
      }
      editorParent.style.display = 'block';
      quill.enable();
      // Focus after a short delay to ensure visibility
      setTimeout(() => quill.focus(), 0);
    } else {
      // Hide
      editorParent.style.display = 'none';
      quill.disable();
    }
  }, [isEditing, activeTopic]); 


  // Keyboard shortcut effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing) {
        keySequenceRef.current = (keySequenceRef.current + e.key).slice(-3).toLowerCase();
        if (keySequenceRef.current === 'knt') {
          handleSave();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, handleSave]);


  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const selectTopic = (topic: Topic | null) => {
    setIsEditing(false); // Always exit editing mode when changing topic
    setSelectedTopic(topic);
  };

  const sortedTopics = useMemo(() => {
    return [...topics].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name, 'tr');
    });
  }, [topics]);

  // Topic Selection Grid View
  if (!activeTopic) {
    return (
      <div className="relative text-center w-full animate-fade-in">
        <button onClick={onBack} aria-label="Ana menüye geri dön" className="absolute top-0 left-0 text-slate-400 hover:text-white transition-colors duration-200 z-10 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-8">Konu Özetleri</h2>
        <div className={`grid ${isMobileLayout ? 'grid-cols-1' : 'md:grid-cols-3'} gap-6`}>
          {sortedTopics.map((topic, index) => {
            const iconComponent = availableIcons.find(icon => icon.name === topic.iconName)?.component;
            const hasSummary = topic.summary && topic.summary.trim().length > 0 && topic.summary.trim() !== '<p><br></p>';
            return (
              <div key={topic.id} className="relative group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div
                  onClick={() => selectTopic(topic)}
                  className={`w-full h-48 cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${topic.bgColor} bg-opacity-80 border-2 border-slate-700/50 hover:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/50`}
                >
                  <div className={`p-3 rounded-full mb-3 transition-transform duration-300 group-hover:scale-110 ${topic.color}`}>
                    {iconComponent}
                  </div>
                  <h3 className="text-lg text-center font-semibold text-white">{topic.name}</h3>
                  <p className={`text-sm mt-1 ${hasSummary ? 'text-slate-400' : 'text-amber-400'}`}>{hasSummary ? 'Özet Mevcut' : 'Özet Yok'}</p>
                </div>

                <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(topic.id); }}
                    title={topic.isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}
                    className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <StarIcon />
                  </button>
                </div>

                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenEditTopicModal(topic); }}
                    title="Konuyu Düzenle"
                    className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <EditIcon />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteTopic(topic.id); }}
                    title="Konuyu Sil"
                    className="p-1.5 bg-slate-800/60 rounded-full text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
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
  }

  const hasSummaryContent = activeTopic && activeTopic.summary && activeTopic.summary.trim().length > 0 && activeTopic.summary.trim() !== '<p><br></p>';

  // Summary Detail and Editor View
  return (
    <div className="relative bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto animate-fade-in">
       <button onClick={() => selectTopic(null)} aria-label="Konu listesine geri dön" className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors duration-200 z-10 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        <span>Konular</span>
      </button>

      <div className="w-full bg-slate-900/50 rounded-lg border-2 border-slate-700 flex flex-col mt-16 md:mt-12">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center shrink-0 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-lg ${activeTopic.color} shrink-0`}>
              {availableIcons.find(icon => icon.name === activeTopic.iconName)?.component}
            </div>
            <h3 className="text-xl font-semibold text-white truncate">{activeTopic.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <div className="relative" ref={themeMenuRef}>
                <button
                  onClick={() => setIsThemeMenuOpen(prev => !prev)}
                  className="p-1.5 text-sm rounded-md bg-slate-700 hover:bg-slate-600 transition-colors shrink-0"
                  aria-label="Okuma temasını değiştir"
                  title="Okuma Teması"
                >
                  {summaryTheme === 'light' ? <SunIcon className="h-5 w-5 text-amber-300" /> : <MoonIcon className="h-5 w-5 text-indigo-300" />}
                </button>
                {isThemeMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-20 animate-fade-in">
                    <button
                      onClick={() => { setSummaryTheme('light'); setIsThemeMenuOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-t-md transition-colors ${summaryTheme === 'light' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                    >
                      <SunIcon className="h-5 w-5" /> Açık Mod
                    </button>
                    <button
                      onClick={() => { setSummaryTheme('dark'); setIsThemeMenuOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-b-md transition-colors ${summaryTheme === 'dark' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                    >
                      <MoonIcon className="h-5 w-5" /> Koyu Mod
                    </button>
                  </div>
                )}
              </div>
            )}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-slate-700 hover:bg-slate-600 transition-colors shrink-0"
              >
                <EditIcon />
                Düzenle
              </button>
            )}
          </div>
        </div>
        <div className={`p-6 overflow-y-auto flex-grow min-h-[50vh] rounded-b-lg transition-colors duration-300 ${isEditing ? 'bg-slate-900/30' : (summaryTheme === 'light' ? 'bg-gray-50' : 'bg-slate-900/30')}`}>
          
          <div ref={editorContainerRef} style={{ display: 'none' }} />

          {!isEditing && (
            <div>
              {hasSummaryContent ? (
                  <div 
                      className={`max-w-none ${summaryTheme === 'light' ? 'prose-light' : 'prose-dark'}`} 
                      dangerouslySetInnerHTML={{ __html: activeTopic.summary }}
                  />
              ) : (
                  <div className={`text-center flex flex-col items-center justify-center h-full ${summaryTheme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    <p>Bu konu için bir özet bulunmuyor.</p>
                    <button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 text-sm rounded-md bg-cyan-600 hover:bg-cyan-500 text-white transition-colors">
                        Özet Ekle
                    </button>
                  </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {isEditing && (
        <div className="flex justify-end gap-4 mt-4 animate-fade-in">
          <button onClick={handleCancel} className="px-6 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors">İptal</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Değişiklikleri Kaydet</button>
        </div>
      )}
    </div>
  );
};

export default SummariesView;
