
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { QuizViewProps, Question, QuestionState } from '../types'; 
import ProgressBar from './ProgressBar';
import TrashIcon from './icons/TrashIcon';
import CorrectIcon from './icons/CorrectIcon';
import IncorrectIcon from './icons/IncorrectIcon';
import EditIcon from './icons/EditIcon';
import NoteIcon from './icons/NoteIcon';
import EditQuestionModal from './EditQuestionModal'; 
import LightbulbIcon from './icons/LightbulbIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon'; 
import ChevronRightIcon from './icons/ChevronRightIcon'; 
import HomeIcon from './icons/HomeIcon'; 
import BrainIcon from './icons/BrainIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import SpeakerIcon from './icons/SpeakerIcon';

declare const Quill: any; 

const QuizView: React.FC<QuizViewProps> = ({ 
  topic, 
  onQuizComplete, 
  onBack, 
  onBackToHome, 
  onDeleteQuestion, 
  onEditQuestion, 
  isMobileLayout,
  onUpdateQuestionNote,
  onToggleQuestionBookmark,
  questionStates: initialQuestionStates, 
  mobileFontSize,
  desktopFontSize,
  mode = 'practice',
  examDuration = 0,
  isTextToSpeechEnabled,
  isAiExplanationEnabled,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizHistory, setQuizHistory] = useState<QuestionState[]>(initialQuestionStates);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(false);
  
  // AI States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);

  // Timer State for Exam Mode
  const [timeLeft, setTimeLeft] = useState(examDuration * 60); // in seconds

  const isShuffledQuiz = !!topic.originalId || topic.id.startsWith('shuffled-') || topic.id.startsWith('exam-'); 
  const currentQuestion = topic.questions[currentQuestionIndex];
  
  const noteEditorRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
      setHasSpeechSupport(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  // Initialize Quill instance
  useEffect(() => {
    if (noteEditorRef.current && typeof Quill !== 'undefined' && !quillInstanceRef.current) {
      quillInstanceRef.current = new Quill(noteEditorRef.current, {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'color': [] }],
            ['clean']
          ]
        },
        placeholder: 'Bu soruyla ilgili ipuçlarını veya notlarınızı buraya yazın...',
        theme: 'snow',
      });
      quillInstanceRef.current.on('text-change', () => {
      });
      quillInstanceRef.current.disable(); 
    }

    return () => {
        if (autoAdvanceTimeoutRef.current) {
          clearTimeout(autoAdvanceTimeoutRef.current);
          autoAdvanceTimeoutRef.current = null;
        }
        if (quillInstanceRef.current && typeof quillInstanceRef.current.destroy === 'function') {
            quillInstanceRef.current.destroy();
            quillInstanceRef.current = null;
        }
    };
  }, []); 

  // Exam Timer Logic
  useEffect(() => {
    if (mode === 'exam' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, timeLeft]);

  // TTS Cleanup and Trigger on Question Change
  useEffect(() => {
      // Stop speaking when question changes or component unmounts
      if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
      }
  }, [currentQuestionIndex, topic]); // Dependency on index change

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Reset state on topic change
  useEffect(() => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }

    setQuizHistory(initialQuestionStates); 
    setCurrentQuestionIndex(0); 
    setIsNoteVisible(false);
    setIsHintVisible(false);
    setAiExplanation('');
    
    if (quillInstanceRef.current && topic.questions.length > 0) {
        quillInstanceRef.current.root.innerHTML = topic.questions[0]?.note || '';
        quillInstanceRef.current.disable(); 
    }
  }, [topic, initialQuestionStates]); 

  // Sync UI with current question
  useEffect(() => {
    if (quizHistory.length === 0 || !currentQuestion || !quillInstanceRef.current) return;

    const currentQuestionState = quizHistory[currentQuestionIndex];
    
    quillInstanceRef.current.root.innerHTML = currentQuestion?.note || '';
    
    // In Exam mode, never show hint based on wrong answer automatically
    if (mode !== 'exam') {
        setIsHintVisible(
        currentQuestionState.isAnswered && 
        currentQuestionState.isCorrect === false && 
        !!currentQuestion?.note
        );
    } else {
        setIsHintVisible(false);
    }

    // Reset AI explanation when changing question
    setAiExplanation('');
    setIsAiModalOpen(false);

    // FIX: Enhanced focus management for mobile devices.
    // Explicitly blur the active element immediately to prevent sticky focus
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }

    // Move focus to container to reset browser focus state
    if (containerRef.current) {
        containerRef.current.focus({ preventScroll: true });
        containerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);

  }, [currentQuestionIndex, topic, quizHistory, currentQuestion, mode]);

  useEffect(() => {
    if (quillInstanceRef.current) {
        if (isNoteVisible) {
            quillInstanceRef.current.enable();
            setTimeout(() => quillInstanceRef.current.focus(), 0);
        } else {
            quillInstanceRef.current.disable();
        }
    }
  }, [isNoteVisible]);


  const handleAnswerSelect = (index: number) => {
    if (quizHistory[currentQuestionIndex]?.isAnswered) return;

    // Blur immediately upon selection to prevent state carry-over
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const isCurrentCorrect = index === currentQuestion.correctAnswerIndex;

    setQuizHistory(prevHistory => {
      const newHistory = [...prevHistory];
      newHistory[currentQuestionIndex] = {
        selectedAnswerIndex: index,
        isCorrect: isCurrentCorrect,
        isAnswered: true,
      };
      return newHistory;
    });

    if (mode === 'practice' && !isCurrentCorrect && currentQuestion?.note) {
        setIsHintVisible(true);
    }

    // In Exam mode, simply advance after a short delay, regardless of correctness
    const delay = mode === 'exam' ? 500 : 1500;

    if (mode === 'exam' || isCurrentCorrect) {
      if (currentQuestionIndex < topic.questions.length - 1) {
        autoAdvanceTimeoutRef.current = window.setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
        }, delay); 
      } else {
        // Only auto-finish if it's the last question and we want to finish
        // For exam mode, maybe wait for user to click finish? 
        // Current logic: Auto finish on last correct question (practice) or last question (exam)
        autoAdvanceTimeoutRef.current = window.setTimeout(() => {
          handleFinishQuiz();
        }, delay);
      }
    }
  };
  
  const handleDelete = () => {
      if (window.confirm("Bu soruyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
          const originalTopicId = topic.originalId || topic.id;
          onDeleteQuestion(originalTopicId, currentQuestion.id);
          setIsEditModalOpen(false); 
          
          const newQuestionsCount = topic.questions.length - 1;
          if (currentQuestionIndex >= newQuestionsCount && newQuestionsCount > 0) {
            setCurrentQuestionIndex(newQuestionsCount - 1);
          } else if (newQuestionsCount === 0) {
            setCurrentQuestionIndex(0); 
          }
      }
  };

  const handleSaveQuestion = (updatedQuestion: Question) => {
    if (currentQuestion) {
      const targetTopicId = topic.originalId || topic.id;
      onEditQuestion(targetTopicId, updatedQuestion);
    }
    setIsEditModalOpen(false);
  };

  const handleSaveNote = () => {
    if (!currentQuestion || !quillInstanceRef.current) return;
    const finalNote = quillInstanceRef.current.root.innerHTML;
    const originalTopicId = topic.originalId || topic.id;
    onUpdateQuestionNote(originalTopicId, currentQuestion.id, finalNote);
    setIsNoteVisible(false);
    
    if (mode === 'practice') {
        setIsHintVisible(quizHistory[currentQuestionIndex]?.isAnswered && quizHistory[currentQuestionIndex]?.isCorrect === false && !!finalNote);
    }
  };

  const handleToggleHint = () => setIsHintVisible(prev => !prev);

  const handleToggleBookmark = (e: React.MouseEvent) => {
      e.stopPropagation();
      // Use sourceTopicId if present (mixed mode), otherwise fall back to topic context (originalId or id)
      const targetTopicId = currentQuestion.sourceTopicId || topic.originalId || topic.id;
      onToggleQuestionBookmark(targetTopicId, currentQuestion.id);
  };

  const handleToggleSpeak = () => {
      if (!window.speechSynthesis) return;

      if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
      } else {
          const plainQuestionText = currentQuestion.questionText.replace(/<[^>]+>/g, '');
          const optionsText = currentQuestion.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              return `${letter} seçeneği: ${opt}`;
          }).join('. ');

          const textToRead = `${plainQuestionText}. Seçenekler: ${optionsText}`;
          const utterance = new SpeechSynthesisUtterance(textToRead);
          utterance.lang = 'tr-TR';
          utterance.rate = 0.9;
          
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);

          window.speechSynthesis.speak(utterance);
          setIsSpeaking(true);
      }
  };

  // AI Explanation Handler
  const handleGetAiExplanation = async () => {
    if (!process.env.API_KEY) {
        alert("AI özelliği için API anahtarı bulunamadı.");
        return;
    }

    setIsAiModalOpen(true);
    if (aiExplanation) return; // Don't fetch again if already fetched

    setIsAiLoading(true);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const correctOptionLetter = String.fromCharCode(65 + currentQuestion.correctAnswerIndex);
        const correctOptionText = currentQuestion.options[currentQuestion.correctAnswerIndex];
        
        const prompt = `
        Sen uzman bir öğretmensin. Aşağıdaki çoktan seçmeli soruyu analiz et.
        
        Soru: ${currentQuestion.questionText.replace(/<[^>]*>?/gm, '')}
        Seçenekler:
        ${currentQuestion.options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`).join('\n')}
        
        Doğru Cevap: ${correctOptionLetter}) ${correctOptionText}
        
        Lütfen şunları yap:
        1. Doğru cevabın neden doğru olduğunu kısaca açıkla.
        2. Diğer şıkların neden yanlış olduğunu (varsa çeldiricileri) belirt.
        3. Konuyu pekiştirmek için kısa, akılda kalıcı bir bilgi ver.
        
        Cevabı HTML formatında ver (paragraflar <p>, listeler <ul><li> vb. kullan). Sade ve anlaşılır bir dil kullan.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        if (response.text) {
            setAiExplanation(response.text);
        } else {
            setAiExplanation("AI yanıtı alınamadı.");
        }
    } catch (error) {
        console.error("AI Error:", error);
        setAiExplanation("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
        setIsAiLoading(false);
    }
  };


  const getButtonClass = (index: number) => {
    const currentQuestionState = quizHistory[currentQuestionIndex];
    if (!currentQuestionState?.isAnswered) {
      return 'bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-500';
    }

    if (mode === 'exam') {
        // Exam Mode: Only show selected state, no colors
        if (index === currentQuestionState.selectedAnswerIndex) {
            return 'bg-cyan-900/40 border-cyan-500 ring-1 ring-cyan-500'; // Neutral selection color
        }
        return 'bg-slate-800 border-slate-700 opacity-50';
    } else {
        // Practice Mode: Show Right/Wrong
        if (index === currentQuestion.correctAnswerIndex) {
            return 'bg-green-900/40 border-green-500 ring-1 ring-green-500'; 
        }
        if (index === currentQuestionState.selectedAnswerIndex) {
            return 'bg-red-900/40 border-red-500 ring-1 ring-red-500';
        }
        return 'bg-slate-800 border-slate-700 opacity-50';
    }
  };

  const getLetterBadgeClass = (index: number) => {
    const currentQuestionState = quizHistory[currentQuestionIndex];
    if (!currentQuestionState?.isAnswered) {
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }

    if (mode === 'exam') {
        if (index === currentQuestionState.selectedAnswerIndex) {
            return 'bg-cyan-600 text-white border-cyan-400';
        }
        return 'bg-slate-800 text-slate-500 border-slate-700';
    } else {
        if (index === currentQuestion.correctAnswerIndex) {
            return 'bg-green-600 text-white border-green-400';
        }
        if (index === currentQuestionState.selectedAnswerIndex) {
            return 'bg-red-600 text-white border-red-400';
        }
        return 'bg-slate-800 text-slate-500 border-slate-700';
    }
  };

  const handlePrevQuestion = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (currentQuestionIndex < topic.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    const finalScore = quizHistory.filter(q => q.isCorrect).length;
    onQuizComplete(finalScore, quizHistory); // Pass full history
  };

  // Keyboard Shortcuts Effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modals are open or text editing is active
      if (isEditModalOpen || isAiModalOpen || isNoteVisible) return;
      
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true')) {
        return;
      }

      const key = e.key.toLowerCase();

      // Navigation
      if (key === 'arrowright' || key === 'enter') {
        handleNextQuestion();
      } else if (key === 'arrowleft') {
        handlePrevQuestion();
      } 
      // Option Selection (1-5 or A-E)
      else if (['1', '2', '3', '4', '5'].includes(key)) {
        const index = parseInt(key) - 1;
        if (index < currentQuestion.options.length) handleAnswerSelect(index);
      } else if (['a', 'b', 'c', 'd', 'e'].includes(key)) {
        const index = key.charCodeAt(0) - 97;
        if (index < currentQuestion.options.length) handleAnswerSelect(index);
      }
      // Toggle Hint
      else if (key === 'h' && mode !== 'exam' && currentQuestion?.note) {
        handleToggleHint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentQuestion, 
    currentQuestionIndex, 
    isEditModalOpen, 
    isAiModalOpen, 
    isNoteVisible, 
    mode, 
    quizHistory,
    topic.questions.length
  ]);
  
  if (!currentQuestion) {
    return (
      <div className="relative bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-2xl w-full animate-fade-in text-center">
        <p className="text-white text-xl">Bu konu için soru bulunmuyor.</p>
        <button onClick={onBack} className="mt-4 px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Geri Dön</button>
      </div>
    );
  }

  const currentQuestionState = quizHistory[currentQuestionIndex];
  const hasNoteForCurrentQuestion = !!currentQuestion.note;
  const isLastQuestion = currentQuestionIndex === topic.questions.length - 1;

  return (
    <div 
        ref={containerRef}
        tabIndex={-1} 
        className={`relative bg-slate-800/50 ${isMobileLayout ? 'px-2 py-1' : 'p-8'} ${isMobileLayout ? 'rounded-none border-x-0 border-t-0' : 'rounded-2xl'} shadow-2xl w-full animate-fade-in flex flex-col ${isMobileLayout ? 'h-full' : 'min-h-[60vh]'} outline-none`}
    >
      
      {/* Header: Controls & Topic Title */}
      <div className="flex items-center justify-between mb-0 shrink-0">
        <div className="flex items-center gap-2">
            <button 
                onClick={onBackToHome} 
                aria-label="Ana menüye geri dön" 
                className="p-2 rounded-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors duration-200"
            >
                <HomeIcon className="h-5 w-5" />
            </button>
        </div>
        
        {/* Exam Timer Display */}
        {mode === 'exam' && (
            <div className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-full ${timeLeft < 60 ? 'bg-red-900/50 text-red-400 border border-red-500/50 animate-pulse' : 'bg-slate-900 text-cyan-400 border border-slate-700'}`}>
                <span className="text-xs font-bold uppercase tracking-wider">Süre</span>
                <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
            </div>
        )}

        <div className="text-right flex-1 pl-4 flex items-center justify-end gap-2">
             <h2 className={`font-bold text-cyan-400 ${isMobileLayout ? 'text-sm' : 'text-lg'} truncate max-w-[150px] md:max-w-md`}>{topic.name}</h2>
             {/* TTS Button - Only visible if enabled in settings AND supported by browser */}
             {isTextToSpeechEnabled && hasSpeechSupport && (
                 <button
                    onClick={handleToggleSpeak}
                    className={`p-1.5 rounded-full transition-colors ${isSpeaking ? 'bg-cyan-600 text-white animate-pulse' : 'hover:bg-slate-700 text-slate-300'}`}
                    title={isSpeaking ? "Okumayı Durdur" : "Sesli Oku"}
                 >
                    <SpeakerIcon isSpeaking={isSpeaking} className="h-5 w-5" />
                 </button>
             )}
             {/* Bookmark Button in Header */}
             <button
                onClick={handleToggleBookmark}
                className="p-1.5 rounded-full hover:bg-slate-700 transition-colors"
                title={currentQuestion.isBookmarked ? "Favorilerden Çıkar" : "Favorilere Ekle"}
             >
                <BookmarkIcon isBookmarked={currentQuestion.isBookmarked} className="h-5 w-5" />
             </button>
        </div>
      </div>

      <div className="shrink-0 mb-1">
        <ProgressBar 
            currentQuestionIndex={currentQuestionIndex} 
            totalQuestions={topic.questions.length} 
            questionStates={quizHistory} 
            topic={topic}
            mode={mode}
        />
      </div>

      <div className={`${isMobileLayout ? 'flex-none w-full' : 'flex-grow'} flex flex-col ${isMobileLayout ? 'justify-start mt-0' : 'justify-center my-4'} overflow-hidden`}>
        
        {/* Feedback Badge Area - Moved above question text - ONLY IN PRACTICE MODE */}
        {(mode === 'practice' || mode === 'mistakes' || mode === 'bookmarks') && currentQuestionState?.isAnswered && (
            <div className="flex justify-center mb-1 gap-2">
                <div
                    onClick={!currentQuestionState.isCorrect ? handleNextQuestion : undefined}
                    className={`py-1 px-4 rounded-full shadow-lg transition-all duration-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                    currentQuestionState.isCorrect ? 'bg-green-600 text-white cursor-default' : 'bg-red-600 text-white hover:bg-red-500 cursor-pointer'
                    }`}
                >
                    {currentQuestionState.isCorrect ? (
                        <><CorrectIcon className="h-5 w-5" /> Doğru</>
                    ) : (
                        <><IncorrectIcon className="h-5 w-5" /> Yanlış</>
                    )}
                </div>
                
                {/* AI Explanation Button - Conditionally Rendered based on settings */}
                {isAiExplanationEnabled && !currentQuestionState.isCorrect && (
                    <button
                        onClick={handleGetAiExplanation}
                        className="py-1 px-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg transition-colors border border-indigo-400/50"
                    >
                        <BrainIcon className="h-4 w-4" />
                        AI Açıklama
                    </button>
                )}
            </div>
        )}

        {/* Question Text Card */}
        <div className={`bg-slate-900/40 ${isMobileLayout ? 'p-2 mt-0' : 'p-4'} rounded-xl border border-slate-700/50 shadow-inner relative overflow-y-auto max-h-[40vh]`}>
            <div 
                className={`${isMobileLayout ? mobileFontSize : desktopFontSize} text-white font-medium leading-normal text-center py-0.5 prose-dark max-w-none`}
                dangerouslySetInnerHTML={{ __html: currentQuestion.questionText }} 
            />
        </div>
      </div>

      {/* Hint / Note Display - Hidden in Exam Mode unless forced (which we disabled above) */}
      {isHintVisible && currentQuestion.note && (
        <div className="shrink-0 mb-1 p-2 bg-amber-900/30 rounded-lg border border-amber-500/50 animate-fade-in flex items-start gap-3 mt-1">
          <LightbulbIcon isActive={true} className="h-6 w-6 text-amber-400 shrink-0 mt-1" />
          <div className="flex-grow">
            <h4 className="font-bold text-amber-300 mb-1 text-sm uppercase tracking-wide">İpucu</h4>
            <div 
              className="text-amber-100/90 text-sm prose-dark max-w-none" 
              dangerouslySetInnerHTML={{ __html: currentQuestion.note }} 
            />
          </div>
        </div>
      )}

      {/* Note Editor */}
      <div className={`shrink-0 my-1 p-2 bg-slate-900/50 rounded-lg border border-slate-700 animate-fade-in ${isNoteVisible ? 'block' : 'hidden'}`}>
          <label htmlFor="question-note-editor" className="block text-sm font-medium text-slate-300 mb-2">Soruyla İlgili Notlarınız</label>
          <div id="question-note-editor" ref={noteEditorRef} className="quill-editor" />
          <div className="flex justify-end gap-2 mt-4">
              <button onClick={handleSaveNote} className="px-4 py-1.5 text-sm rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Notu Kaydet</button>
          </div>
      </div>

      {/* Options Grid */}
      <div className={`flex-grow overflow-y-auto grid ${isMobileLayout ? 'grid-cols-1 gap-2 mt-1 content-start' : 'md:grid-cols-2 gap-4 mt-4 content-center'}`}>
        {currentQuestion.options.map((option, index) => (
          <button
            key={`${currentQuestion.id}-${index}`}
            onClick={() => handleAnswerSelect(index)}
            disabled={currentQuestionState?.isAnswered} 
            className={`
                group relative w-full ${isMobileLayout ? 'p-2.5 min-h-[3rem]' : 'p-4'} rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-2
                ${getButtonClass(index)}
                ${!currentQuestionState?.isAnswered ? 'active:scale-[0.98]' : ''}
            `}
          >
            <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors
                ${getLetterBadgeClass(index)}
            `}>
                {String.fromCharCode(65 + index)}
            </div>
            <span className={`font-medium flex-grow ${currentQuestionState?.isAnswered && index !== currentQuestionState.selectedAnswerIndex && index !== currentQuestion.correctAnswerIndex ? (mode === 'exam' ? 'text-slate-400' : 'text-slate-400') : 'text-slate-200'}`}>
                {option}
            </span>
            
            {/* Answer Icons - Only in Practice Mode */}
            {mode === 'practice' && currentQuestionState?.isAnswered && ( 
                <div className="flex-shrink-0">
                    {index === currentQuestion.correctAnswerIndex && (
                        <CorrectIcon className="h-6 w-6 text-green-400" />
                    )}
                    {index === currentQuestionState.selectedAnswerIndex && index !== currentQuestion.correctAnswerIndex && (
                        <IncorrectIcon className="h-6 w-6 text-red-400" />
                    )}
                </div>
            )}
          </button>
        ))}
      </div>

      {/* Footer Controls */}
      <div className={`${isMobileLayout ? 'mt-1' : 'mt-4'} pt-1 border-t border-slate-700/50 flex flex-nowrap items-center justify-between gap-3 w-full shrink-0 relative`}>
          <div className="flex items-center gap-1 flex-shrink-0"> 
              {/* Only show Edit/Note buttons in Practice Mode */}
              {mode === 'practice' && (
                <>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                    aria-label="Soruyu düzenle"
                    title="Soruyu Düzenle"
                  >
                      <EditIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsNoteVisible(prev => !prev)}
                    className={`p-2.5 rounded-lg transition-all ${isNoteVisible ? 'bg-cyan-900/30 text-cyan-400' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                    title="Not Ekle/Düzenle"
                  >
                      <NoteIcon className="h-5 w-5" />
                  </button>
                </>
              )}
              {/* Hide Hint button in Exam Mode */}
              {mode !== 'exam' && (
                <button
                    onClick={handleToggleHint}
                    disabled={!hasNoteForCurrentQuestion}
                    className={`p-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isHintVisible ? 'bg-amber-900/30 text-amber-400' : 'bg-slate-800 text-slate-400 hover:text-amber-300 hover:bg-slate-700'}`}
                    title={hasNoteForCurrentQuestion ? (isHintVisible ? "İpucunu Gizle" : "İpucu Göster") : "Bu soru için ipucu yok"}
                >
                    <LightbulbIcon isActive={hasNoteForCurrentQuestion} className="h-5 w-5" />
                </button>
              )}
          </div>

          <div className="flex items-center gap-3 flex-grow justify-end min-w-0">
            {/* Allow Previous in Exam Mode to change answers, although current logic locks it. Keeping it enabled for navigation. */}
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`
                h-10 min-w-[6rem] px-4 rounded-lg border border-transparent flex-shrink-0
                bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700
                disabled:opacity-50 disabled:cursor-not-allowed transition-all
                flex items-center justify-center gap-2 font-medium text-sm
              `}
              title="Önceki Soru (Sol Ok)"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="inline">Önceki</span>
            </button>
            <button
              onClick={handleNextQuestion}
              className={`
                h-10 min-w-[6rem] px-4 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 font-bold 
                transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 text-sm
              `}
              title={isLastQuestion ? "Testi Bitir" : "Sonraki Soru (Sağ Ok / Enter)"}
            >
              <span className="inline">
                {isLastQuestion ? "Bitir" : "Sonraki"}
              </span>
              {isLastQuestion ? (
                 <CorrectIcon className="h-5 w-5 text-white" />
              ) : (
                 <ChevronRightIcon className="h-5 w-5" />
              )}
            </button>
          </div>
      </div>
      
      {/* Desktop Keyboard Hints */}
      {!isMobileLayout && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-600 hidden md:flex gap-4 opacity-75 hover:opacity-100 transition-opacity select-none pointer-events-none">
            <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1 rounded border border-slate-700 font-mono">←</kbd> <kbd className="bg-slate-800 px-1 rounded border border-slate-700 font-mono">→</kbd> Navigasyon</span>
            <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1 rounded border border-slate-700 font-mono">1</kbd>-<kbd className="bg-slate-800 px-1 rounded border border-slate-700 font-mono">5</kbd> Seçim</span>
            <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1 rounded border border-slate-700 font-mono">Enter</kbd> İlerle</span>
        </div>
      )}

      {isEditModalOpen && currentQuestion && (
        <EditQuestionModal
          question={currentQuestion}
          onSave={handleSaveQuestion}
          onClose={() => setIsEditModalOpen(false)}
          onDelete={handleDelete}
        />
      )}

      {/* AI Explanation Modal */}
      {isAiModalOpen && (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[80] animate-fade-in"
            onClick={() => setIsAiModalOpen(false)}
        >
            <div 
                className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative border border-indigo-500/50 max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-4 shrink-0">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <BrainIcon className="h-6 w-6 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-indigo-400">Yapay Zeka Açıklaması</h3>
                    <button onClick={() => setIsAiModalOpen(false)} className="ml-auto text-slate-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2">
                    {isAiLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                            <p>Soru analiz ediliyor, lütfen bekleyin...</p>
                        </div>
                    ) : (
                        <div className="prose-dark text-slate-300 space-y-4">
                            <div dangerouslySetInnerHTML={{ __html: aiExplanation }} />
                        </div>
                    )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-end">
                    <button onClick={() => setIsAiModalOpen(false)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-semibold transition-colors">
                        Anladım
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default QuizView;
