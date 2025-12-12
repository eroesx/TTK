
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { SummariesViewProps, Topic } from '../types';
import EditIcon from './icons/EditIcon';
import AddIcon from './icons/AddIcon';
import TrashIcon from './icons/TrashIcon';
import StarIcon from './icons/StarIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import BrainIcon from './icons/BrainIcon';
import SpeakerIcon from './icons/SpeakerIcon';

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
  
  // AI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  // Stop speech when component unmounts or topic changes
  useEffect(() => {
    return () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    };
  }, [selectedTopic]);

  const handleSave = useCallback(() => {
    if (activeTopic && quillInstanceRef.current) {
      const newSummary = quillInstanceRef.current.root.innerHTML;
      onUpdateSummary(activeTopic.id, newSummary);
      setIsEditing(false);
    }
  }, [activeTopic, onUpdateSummary]);

  // Effect to CREATE Quill instance ONCE when a topic is selected.
  useEffect(() => {
    if (activeTopic && editorContainerRef.current && !quillInstanceRef.current) {
      const editorElement = document.createElement('div');
      editorContainerRef.current.appendChild(editorElement);
      const quill = new Quill(editorElement, {
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
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
    // Cleanup on topic change.
    return () => {
      // FIX: Check if quillInstanceRef.current exists and has a destroy method before calling.
      if (quillInstanceRef.current && typeof quillInstanceRef.current.destroy === 'function') {
        quillInstanceRef.current.destroy();
      }
      quillInstanceRef.current = null;
      if (editorContainerRef.current) {
        editorContainerRef.current.innerHTML = '';
      }
    };
  }, [activeTopic]);

  // Effect to manage visibility, content, and state of the EXISTING Quill instance.
  useEffect(() => {
    const quill = quillInstanceRef.current;
    if (!quill) return;

    const editorParent = editorContainerRef.current;
    if (!editorParent) return;

    if (isEditing) {
      // Stop speech if editing starts
      if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
      }

      // Set content and make visible
      // Only reset content if it's currently empty or strictly equals the saved summary (to avoid overwriting unsaved work if re-rendering)
      // Ideally, we load it once when entering edit mode.
      // Here we rely on the component mount logic mostly.
      if (quill.root.innerHTML === '<p><br></p>' || quill.root.innerHTML === activeTopic?.summary) {
         quill.root.innerHTML = activeTopic?.summary || '';
      }
      
      editorParent.style.display = 'block';
      quill.enable();
      // Increase editor height in edit mode
      const editorDiv = editorParent.querySelector('.ql-editor');
      if(editorDiv) {
          (editorDiv as HTMLElement).style.minHeight = '400px';
      }
      setTimeout(() => quill.focus(), 0);
    } else {
      // Hide
      editorParent.style.display = 'none';
      quill.disable();
    }
  }, [isEditing, activeTopic, isSpeaking]);


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
    setAiMessage('');
  };
  
  const selectTopic = (topic: Topic | null) => {
    setIsEditing(false); // Always exit editing mode when changing topic
    setSelectedTopic(topic);
    setAiMessage('');
    setIsSpeaking(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  const handleToggleSpeech = () => {
      if (!activeTopic || !activeTopic.summary) return;

      if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
      } else {
          // Strip HTML tags to get plain text
          const doc = new DOMParser().parseFromString(activeTopic.summary, 'text/html');
          const textContent = doc.body.textContent || "";

          if (!textContent.trim()) return;

          const utterance = new SpeechSynthesisUtterance(textContent);
          utterance.lang = 'tr-TR';
          utterance.rate = 1.0; // Slightly slower than questions for better comprehension of long text
          
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);

          window.speechSynthesis.speak(utterance);
          setIsSpeaking(true);
      }
  };

  const handleGenerateAiSummary = async () => {
    if (!process.env.API_KEY) {
        alert("API anahtarı bulunamadı.");
        return;
    }
    if (!activeTopic) return;
    if (activeTopic.questions.length === 0) {
        alert("Bu konuda analiz edilecek soru bulunmuyor. Lütfen önce soru ekleyin.");
        return;
    }

    if (!window.confirm("Mevcut özetin üzerine, bu konudaki soruların analizinden elde edilen yeni bir özet yazılacak. Devam etmek istiyor musunuz?")) {
        return;
    }

    setIsGenerating(true);
    setAiMessage('Sorular analiz ediliyor ve özet oluşturuluyor...');

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Prepare questions data for the prompt
        const questionsText = activeTopic.questions.map((q, i) => 
            `Soru ${i+1}: ${q.questionText}\nDoğru Cevap: ${q.options[q.correctAnswerIndex]}`
        ).join('\n\n');

        const prompt = `
          Sen uzman bir eğitmen ve sınav hazırlayıcısısın.
          Aşağıda "${activeTopic.name}" konusuyla ilgili hazırlanmış sorular ve doğru cevapları yer almaktadır.
          
          GÖREVİN:
          Bu soruları analiz ederek, öğrencilerin bu konuyu kavramasını sağlayacak, sınavlarda çıkması muhtemel bilgileri içeren, KAPSAMLI ve ÖĞRETİCİ bir konu özeti hazırla.
          
          KURALLAR:
          1. Çıktı HTML formatında olmalıdır. (Sadece body içeriği, html/head tagleri yok).
          2. <h3>, <h4>, <strong>, <ul>, <li>, <p> gibi etiketleri kullanarak okunabilirliği artır.
          3. Sadece sorulardaki bilgilere bağlı kalma, sorulardan yola çıkarak konunun ilgili kısımlarını bütünlüklü anlat.
          4. Önemli terimleri ve anahtar kavramları **kalın** (strong) yaz.
          
          SORULAR VE CEVAPLAR:
          ${questionsText}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        if (response.text) {
            if (quillInstanceRef.current) {
                // Strip markdown code blocks if present (```html ... ```)
                let cleanHtml = response.text.replace(/^```html/, '').replace(/```$/, '').trim();
                quillInstanceRef.current.root.innerHTML = cleanHtml;
                setAiMessage('Özet başarıyla oluşturuldu! Düzenleyip kaydedebilirsiniz.');
            }
        }
    } catch (error) {
        console.error("AI Error:", error);
        setAiMessage('Özet oluşturulurken bir hata meydana geldi.');
    } finally {
        setIsGenerating(false);
    }
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
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
            {!isEditing && hasSummaryContent && (
                <button
                    onClick={handleToggleSpeech}
                    className={`p-1.5 rounded-md transition-colors shrink-0 ${isSpeaking ? 'bg-cyan-600 text-white animate-pulse' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                    title={isSpeaking ? "Okumayı Durdur" : "Sesli Oku"}
                >
                    <SpeakerIcon isSpeaking={isSpeaking} className="h-5 w-5" />
                </button>
            )}
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
        
        {/* AI Generator Section - Only visible in Edit Mode */}
        {isEditing && (
            <div className="p-3 bg-indigo-900/20 border-b border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-indigo-300 text-sm">
                    <BrainIcon className="h-5 w-5" />
                    <span>Yapay Zeka Asistanı</span>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    {isGenerating ? (
                        <div className="flex items-center gap-2 text-slate-300 text-sm">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>Oluşturuluyor...</span>
                        </div>
                    ) : (
                        <button 
                            onClick={handleGenerateAiSummary}
                            className="flex-grow md:flex-none px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded shadow-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <BrainIcon className="h-4 w-4" />
                            Sorulardan Özet Oluştur / Güncelle
                        </button>
                    )}
                </div>
            </div>
        )}
        {aiMessage && isEditing && (
            <div className="bg-indigo-900/40 px-4 py-2 text-xs text-center text-indigo-200 border-b border-indigo-500/20">
                {aiMessage}
            </div>
        )}

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
