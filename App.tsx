
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Topic, Question, Flashcard, QuestionState } from './types';
import { availableIcons, availableColorPalettes, DATA_VERSION } from './data/quizData';
import { defaultBackupData } from './data/defaultBackupData';
import TopicSelection from './components/TopicSelection';
import QuizView from './components/QuizView';
import ResultsView from './components/ResultsView';
import HomeSelection from './components/HomeSelection';
import AddQuestionModal from './components/AddQuestionModal';
import SettingsView from './components/SettingsView';
import SummariesView from './components/SummariesView';
import FlashcardsView from './components/FlashcardsView';
import ViewQuestionsModal from './components/ViewQuestionsModal';
import EditTopicModal from './components/EditTopicModal';
import SaveStatusToast from './components/SaveStatusToast';
import BulkAddFlashcardsModal from './components/BulkAddFlashcardsModal';
import BulkUpdateFlashcardsModal from './components/BulkUpdateFlashcardsModal';
import ManageFlashcardsModal from './components/ManageFlashcardsModal';
import RestoreSummaryModal from './components/RestoreSummaryModal';
import QuizConfigModal from './components/QuizConfigModal';
import ExamConfigModal from './components/ExamConfigModal'; // Import ExamConfigModal

type View = 'home' | 'topicSelection' | 'quiz' | 'results' | 'summaries' | 'bilgiKartlari' | 'settings';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Helper function to generate initial topics from defaultBackupData
const generateInitialTopics = (): Topic[] => {
    return defaultBackupData.appTopics.map(topic => ({
        ...topic,
        // Ensure all properties are correctly typed and present
        isFavorite: topic.isFavorite ?? false,
        flashcards: topic.flashcards ?? [],
        questions: topic.questions.map(q => ({...q})) // Deep copy questions
    }));
};

const useDebouncedSave = (topics: Topic[], appTitle: string) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const timeoutRef = useRef<number | null>(null);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (isInitialMountRef.current) {
        return; // Do not save on initial mount/load
    }

    setSaveStatus('saving');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem('appTopics', JSON.stringify(topics));
        localStorage.setItem('appTitle', appTitle);
        localStorage.setItem('appDataVersion', DATA_VERSION.toString());
        setSaveStatus('saved');
      } catch (error) {
        console.error("Failed to save data:", error);
        setSaveStatus('error');
      }
    }, 1500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [topics, appTitle]);

  useEffect(() => {
      // After the initial data is loaded and set, change the ref.
      if(topics.length > 0) {
          isInitialMountRef.current = false;
      }
  }, [topics]);

  const handleIdle = useCallback(() => {
    if (saveStatus === 'saved' || saveStatus === 'error') {
      setSaveStatus('idle');
    }
  }, [saveStatus]);

  return { saveStatus, onIdle: handleIdle };
};


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isViewQuestionsModalOpen, setIsViewQuestionsModalOpen] = useState(false);
  const [isEditTopicModalOpen, setIsEditTopicModalOpen] = useState(false);
  const [topicForModal, setTopicForModal] = useState<Topic | null>(null);
  // Initialize isMobileLayout based on localStorage or device width
  const [isMobileLayout, setIsMobileLayout] = useState(() => {
    const saved = localStorage.getItem('isMobileLayout');
    if (saved !== null) {
        return JSON.parse(saved);
    }
    // Default to true if screen width < 768px (mobile), otherwise false (desktop)
    return typeof window !== 'undefined' ? window.innerWidth < 768 : true;
  });
  const lastQuizScores = useRef<{[key: string]: number}>({});
  const [previousScore, setPreviousScore] = useState<number | undefined>(undefined);
  const [appTitle, setAppTitle] = useState('TTK GÖREVDE YÜKSELME SINAVI');
  const [mobileFontSize, setMobileFontSize] = useState('text-sm'); // Default: Küçük (10.5pt)
  const [desktopFontSize, setDesktopFontSize] = useState('text-2xl'); // 18pt

  const [quizHistory, setQuizHistory] = useState<QuestionState[]>([]);

  // States for QuizConfigModal
  const [isQuizConfigModalOpen, setIsQuizConfigModalOpen] = useState(false);
  const [topicForQuizConfig, setTopicForQuizConfig] = useState<Topic | null>(null);

  // States for ExamConfigModal
  const [isExamConfigModalOpen, setIsExamConfigModalOpen] = useState(false);
  const [quizMode, setQuizMode] = useState<'practice' | 'exam'>('practice');
  const [examDuration, setExamDuration] = useState(0);


  const [isBulkAddFlashcardsModalOpen, setIsBulkAddFlashcardsModalOpen] = useState(false);
  const [isBulkUpdateFlashcardsModalOpen, setIsBulkUpdateFlashcardsModalOpen] = useState(false);
  const [isManageFlashcardsModalOpen, setIsManageFlashcardsModalOpen] = useState(false);

  const [isRestoreSummaryModalOpen, setIsRestoreSummaryModalOpen] = useState(false);
  const [restoreData, setRestoreData] = useState<{ topics: Topic[], version: number, appTitle?: string } | null>(null);


  const { saveStatus, onIdle } = useDebouncedSave(topics, appTitle);

  // This effect synchronizes the topic objects held in state for modals/views
  // with the main `topics` array. This prevents stale data from being displayed
  // after an update (e.g., adding/deleting questions).
  useEffect(() => {
      // Sync topic for modals (ViewQuestionsModal, EditTopicModal, etc.)
      if (topicForModal) {
          const currentVersionInTopics = topics.find(t => t.id === topicForModal.id);
          // If the topic exists in the main array and the object reference is different, update it.
          if (currentVersionInTopics && currentVersionInTopics !== topicForModal) {
              setTopicForModal(currentVersionInTopics);
          }
      }

      // Sync topic for the active quiz view
      if (selectedTopic) {
          const originalId = selectedTopic.originalId || selectedTopic.id;
          const currentVersionInTopics = topics.find(t => t.id === originalId);

          if (currentVersionInTopics) {
              // For a non-shuffled quiz, simply update the topic object if it's stale.
              if (!selectedTopic.originalId && currentVersionInTopics !== selectedTopic) {
                  setSelectedTopic(currentVersionInTopics);
              }
              // For a shuffled quiz, we need to reflect deletions/edits made to the original topic
              // without losing the shuffled order.
              else if (selectedTopic.originalId) {
                  const originalQuestionsMap = new Map(currentVersionInTopics.questions.map(q => [q.id, q]));
                  
                  const updatedShuffledQuestions = selectedTopic.questions
                      .map(q => originalQuestionsMap.get(q.id)) // Get the updated question version
                      .filter((q): q is Question => q !== undefined); // Filter out deleted questions

                  // Only update state if the questions list has actually changed to avoid loops.
                  const questionsHaveChanged = updatedShuffledQuestions.length !== selectedTopic.questions.length || 
                                             updatedShuffledQuestions.some((q, i) => q !== selectedTopic.questions[i]);

                  if (questionsHaveChanged) {
                      setSelectedTopic(prev => prev ? { ...prev, questions: updatedShuffledQuestions } : null);
                  }
              }
          }
      }
  }, [topics, topicForModal, selectedTopic]);


  useEffect(() => {
    const initializeAppData = () => {
      try {
        const generatedInitialTopics = generateInitialTopics();
        
        const savedTopicsRaw = localStorage.getItem('appTopics');
        const savedVersionRaw = localStorage.getItem('appDataVersion');
        const savedVersion = savedVersionRaw ? parseInt(savedVersionRaw, 10) : 0;
        let finalTopics: Topic[];

        if (savedTopicsRaw && savedTopicsRaw !== 'undefined') {
          const savedTopics: Topic[] = JSON.parse(savedTopicsRaw);

          if (savedVersion < DATA_VERSION) {
            console.log(`Migrating data from version ${savedVersion} to ${DATA_VERSION}`);
            const initialTopicsMap = new Map<string, Topic>();
            generatedInitialTopics.forEach(t => initialTopicsMap.set(t.id, t));
            
            const userTopics = savedTopics.filter((t: Topic) => !initialTopicsMap.has(t.id));

            const migratedTopics = generatedInitialTopics.map(initialTopic => {
              const savedVersionOfTopic = savedTopics.find(st => st.id === initialTopic.id);
              if (savedVersionOfTopic) {
                 // Preserve user data (favorites, notes, etc.) while updating core content
                 return {
                   ...initialTopic, // take structure and core content from new data
                   ...savedVersionOfTopic, // override with user's specific data
                   questions: initialTopic.questions.map(q => { // Keep notes on old questions
                       const oldQ = savedVersionOfTopic.questions.find(old => old.id === q.id);
                       return oldQ?.note ? {...q, note: oldQ.note} : q;
                   }), 
                   summary: initialTopic.summary, // always overwrite summary with new data
                 };
              }
              return initialTopic;
            });
            
            finalTopics = [...migratedTopics, ...userTopics];
            alert('Uygulama verileri en son sürüme güncellendi!');
          } else {
            finalTopics = savedTopics;
          }
        } else {
          finalTopics = generatedInitialTopics;
        }
        setTopics(finalTopics);
      } catch (e) {
        console.error("Initialization error:", e);
        // If parsing fails, reset to default data
        const defaultTopics = generateInitialTopics();
        setTopics(defaultTopics);
      } finally {
        setIsLoading(false);
      }
    };

    const savedAppTitle = localStorage.getItem('appTitle');
    if (savedAppTitle) {
      setAppTitle(savedAppTitle);
    } else {
      setAppTitle(defaultBackupData.appTitle);
    }

    const savedMobileFontSize = localStorage.getItem('mobileFontSize');
    if (savedMobileFontSize) {
      setMobileFontSize(savedMobileFontSize);
    }
    const savedDesktopFontSize = localStorage.getItem('desktopFontSize');
    if (savedDesktopFontSize) {
      setDesktopFontSize(savedDesktopFontSize);
    }

    initializeAppData();
  }, []);

  const handleSelectTopic = (topic: Topic, options: { questionCount: number; shuffle: boolean; showHints: boolean; }) => {
    setQuizMode('practice');
    setExamDuration(0);
    
    let questionsToUse = [...topic.questions];

    // Apply questionCount filter
    if (options.questionCount > 0 && options.questionCount < questionsToUse.length) {
      questionsToUse = questionsToUse.slice(0, options.questionCount);
    }
    
    // Apply shuffle
    if (options.shuffle) {
      questionsToUse.sort(() => Math.random() - 0.5);
    }

    const topicForQuiz = { 
      ...topic, 
      questions: questionsToUse,
      showHints: options.showHints,
      id: options.shuffle ? `shuffled-${topic.id}-${Date.now()}` : topic.id, // Ensure unique ID for shuffled quiz instance
      originalId: topic.id // Keep track of the original topic ID
    };

    setSelectedTopic(topicForQuiz);
    
    // Initialize quiz history for the new quiz
    setQuizHistory(topicForQuiz.questions.map(() => ({
      selectedAnswerIndex: null,
      isCorrect: null,
      isAnswered: false,
    })));

    // Set previous score for the results view
    const originalTopicId = topic.id;
    const lastScore = lastQuizScores.current[originalTopicId];
    if (lastScore !== undefined) {
        const totalQuestions = topic.questions.length; // Use original total for previous score percentage
        const percentage = totalQuestions > 0 ? Math.round((lastScore / totalQuestions) * 100) : 0;
        setPreviousScore(percentage);
    } else {
        setPreviousScore(undefined);
    }
    
    setCurrentView('quiz');
  };

  const handleStartExam = (config: { questionCount: number; duration: number }) => {
    // Aggregate all questions
    let allQuestions: Question[] = [];
    topics.forEach(topic => {
      allQuestions = [...allQuestions, ...topic.questions];
    });

    // Shuffle
    allQuestions.sort(() => Math.random() - 0.5);

    // Limit to requested count
    const questionsToUse = allQuestions.slice(0, config.questionCount).map((q, idx) => ({
        ...q,
        id: Date.now() + idx, // Regenerate IDs to avoid key conflicts or topic reference issues in this mixed mode
    }));

    // Create a dummy topic for the exam
    const examTopic: Topic = {
        id: `exam-${Date.now()}`,
        name: "Genel Deneme Sınavı",
        iconName: 'Quiz',
        color: 'bg-violet-500/20',
        bgColor: 'bg-violet-900/40',
        questions: questionsToUse,
        summary: '',
        flashcards: [],
        showHints: false
    };

    setSelectedTopic(examTopic);
    setQuizMode('exam');
    setExamDuration(config.duration);
    
    // Initialize quiz history
    setQuizHistory(questionsToUse.map(() => ({
      selectedAnswerIndex: null,
      isCorrect: null,
      isAnswered: false,
    })));

    setPreviousScore(undefined); // No previous score for random exams
    setIsExamConfigModalOpen(false);
    setCurrentView('quiz');
  };

  const handleOpenQuizConfigModal = (topic: Topic) => {
    setTopicForQuizConfig(topic);
    setIsQuizConfigModalOpen(true);
  };

  const handleQuizComplete = (score: number) => { // Score parameter is now the calculated score from QuizView
    setQuizScore(score);
    if (selectedTopic && quizMode === 'practice') {
        // Store score against the original topic ID even for shuffled quizzes
        const originalTopicId = selectedTopic.originalId || selectedTopic.id;
        lastQuizScores.current = { ...lastQuizScores.current, [originalTopicId]: score };
    }
    setCurrentView('results');
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setCurrentView('topicSelection');
  };

  const handleBackToHome = () => {
    setSelectedTopic(null);
    setCurrentView('home');
  };

  const handleAddQuestion = (topicId: string, newQuestion: Question) => {
    setTopics(prevTopics =>
      prevTopics.map(topic =>
        topic.id === topicId
          ? { ...topic, questions: [...topic.questions, newQuestion] }
          : topic
      )
    );
  };

  const handleOpenAddQuestionModal = (topic: Topic) => {
    setTopicForModal(topic);
    setIsAddQuestionModalOpen(true);
  };

  const handleOpenViewQuestionsModal = (topic: Topic) => {
    setTopicForModal(topic);
    setIsViewQuestionsModalOpen(true);
  };

  const handleOpenEditTopicModal = (topic: Topic) => {
    setTopicForModal(topic);
    setIsEditTopicModalOpen(true);
  };

  const handleAddNewTopic = () => {
    // FIX: Add default color and bgColor properties from availableColorPalettes[0]
    // Create a blank topic object to be populated by the modal
    const newTopic: Topic = {
        id: `custom-${Date.now()}`,
        name: "", // Will be set in modal
        iconName: availableIcons[0].name,
        color: availableColorPalettes[0].color, // Default color
        bgColor: availableColorPalettes[0].bgColor, // Default background color
        questions: [],
        summary: '',
        flashcards: [],
        isFavorite: false,
    };
    setTopicForModal(newTopic);
    setIsEditTopicModalOpen(true);
};

const handleSaveTopic = (updatedTopic: Topic) => {
    const isNew = !topics.some(t => t.id === updatedTopic.id);
    if (isNew) {
        // Create a more stable ID based on the name for new topics
        const finalNewTopic = {
            ...updatedTopic,
            id: updatedTopic.name.toLowerCase().replace(/ /g, '-') + `-${Date.now()}`
        };
        setTopics(prev => [...prev, finalNewTopic]);
    } else {
        setTopics(prev => prev.map(t => t.id === updatedTopic.id ? updatedTopic : t));
    }
    setIsEditTopicModalOpen(false);
    setTopicForModal(null);
};

const handleDeleteTopic = (topicId: string) => {
    const topicToDelete = topics.find(t => t.id === topicId);
    if (topicToDelete && window.confirm(`'${topicToDelete.name}' konusunu ve içindeki tüm soruları, özetleri, bilgi kartlarını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
        setTopics(prev => prev.filter(t => t.id !== topicId));
    }
};

const handleEditQuestion = (topicId: string, updatedQuestion: Question) => {
    setTopics(prevTopics =>
        prevTopics.map(topic =>
            topic.id === topicId
                ? {
                    ...topic,
                    questions: topic.questions.map(q =>
                        q.id === updatedQuestion.id ? updatedQuestion : q
                    ),
                }
                : topic
        )
    );
};

const handleDeleteQuestion = (topicId: string, questionId: number) => {
    setTopics(prevTopics =>
        prevTopics.map(topic => {
            if (topic.id === topicId) {
                const updatedQuestions = topic.questions.filter(q => q.id !== questionId);
                return { ...topic, questions: updatedQuestions };
            }
            return topic;
        })
    );
};

const handleUpdateQuestionNote = (topicId: string, questionId: number, note: string) => {
    setTopics(prevTopics => prevTopics.map(topic => {
        if (topic.id === topicId) {
            return {
                ...topic,
                questions: topic.questions.map(q => 
                    q.id === questionId ? { ...q, note: note } : q
                )
            };
        }
        return topic;
    }));
};

const handleUpdateSummary = (topicId: string, newSummary: string) => {
    setTopics(prevTopics => prevTopics.map(topic => 
        topic.id === topicId ? { ...topic, summary: newSummary } : topic
    ));
};

const handleToggleFavorite = (topicId: string) => {
    setTopics(prevTopics => prevTopics.map(topic =>
        topic.id === topicId ? { ...topic, isFavorite: !topic.isFavorite } : topic
    ));
};

const handleToggleMobileLayout = () => {
    setIsMobileLayout(prev => {
        const newLayoutState = !prev;
        localStorage.setItem('isMobileLayout', JSON.stringify(newLayoutState));
        return newLayoutState;
    });
};

const handleResetData = () => {
    if (window.confirm("UYARI: Tüm verilerinizi (eklediğiniz konular, sorular, notlar, favoriler vb.) silmek ve uygulamayı ilk haline döndürmek istediğinizden emin misiniz? Bu işlem geri alınamaz!")) {
        try {
            // Clear all data from localStorage for this origin.
            // This is more robust than removing items one by one.
            localStorage.clear();
            
            alert("Uygulama verileri başarıyla sıfırlandı. Uygulama yeniden başlatılıyor.");
            
            // Reload the page to force re-initialization from the default state.
            window.location.reload();
        } catch (error) {
            console.error("Failed to reset data in localStorage:", error);
            alert("Veriler sıfırlanırken bir hata oluştu.");
        }
    }
};

const handleBackupData = () => {
    try {
        const dataToBackup = {
            appDataVersion: DATA_VERSION,
            appTopics: topics, // This already contains questions, notes, summaries, flashcards, isFavorite
            appTitle: appTitle, // Include appTitle in backup
        };
        const jsonString = JSON.stringify(dataToBackup, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const date = new Date().toISOString().slice(0, 10);
        link.download = `ttk_sinav_yedek_${date}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error("Backup failed:", e);
        alert("Veriler yedeklenirken bir hata oluştu.");
    }
};

const handleRestoreData = (file: File) => {
    // Only prompt if we are about to overwrite without confirmation logic, 
    // but here we are just opening the selection modal.
    // The previous confirm dialog was here, but now we'll move confirmation to the final step or just alert after reading.
    // Actually, reading the file is safe. Applying it is where we need care.
  
    const reader = new FileReader();

    reader.onerror = () => {
        alert('Dosya okunurken bir hata meydana geldi.');
        console.error('File reading failed.');
    };

    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const restoredData = JSON.parse(result);
          
          if (restoredData.appTopics && Array.isArray(restoredData.appTopics)) {
            const newTopics = restoredData.appTopics as Topic[];
            const newVersion = (restoredData.appDataVersion as number) ?? 0; // Default to 0 if undefined/null
            const restoredAppTitle = (restoredData.appTitle as string) ?? undefined;

            setRestoreData({ topics: newTopics, version: newVersion, appTitle: restoredAppTitle });
            setIsRestoreSummaryModalOpen(true);

          } else {
            alert('Yedek dosyası geçersiz veya bozuk. Lütfen doğru formatta bir yedek dosyası seçtiğinizden emin olun. (İçerik yapısı hatalı: "appTopics" alanı bulunamadı.)');
          }
        } else {
             alert('Dosya içeriği okunamadı. Lütfen geçerli bir metin tabanlı yedek (.json) dosyası seçin.');
        }
      } catch (e) {
        console.error("Restore error:", e);
        alert('Yedek dosyası okunurken bir hata oluştu. Dosyanın JSON formatında ve bozuk olmadığından emin olun.');
      }
    };
    reader.readAsText(file);
};

const handleRestoreDefaultData = () => {
    if (window.confirm("UYARI: Mevcut tüm verileriniz silinecek ve uygulamanın varsayılan soru bankası yüklenecektir. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?")) {
      try {
        const { appTopics, appTitle: defaultTitle, appDataVersion: defaultVersion } = defaultBackupData;
        
        // Update state
        setTopics(appTopics);
        setAppTitle(defaultTitle);

        // Update localStorage directly to reflect the change immediately and trigger save.
        // The hook will handle debouncing. Setting the state is the primary way.
        
        alert("Varsayılan veriler başarıyla yüklendi!");
        setCurrentView('home'); // Go back to home view
      } catch (error) {
        console.error("Failed to restore default data:", error);
        alert("Varsayılan veriler yüklenirken bir hata oluştu.");
      }
    }
};

const handleConfirmRestore = (selectedTopics: Topic[]) => {
    if (!restoreData) return;

    try {
        // Merge logic:
        // 1. Create a map of current topics for easy access.
        // 2. Iterate through selected imported topics.
        // 3. Update or Add them to the map.
        // 4. Convert back to array.
        
        // Note: This logic REPLACES the topic if IDs match, effectively updating it.
        // It ADDS the topic if the ID is new.
        // It KEEPS existing topics that were not selected for import.
        
        const mergedTopicsMap = new Map(topics.map(t => [t.id, t]));
        
        selectedTopics.forEach(importedTopic => {
            mergedTopicsMap.set(importedTopic.id, importedTopic);
        });
        
        const finalTopics = Array.from(mergedTopicsMap.values());

        // Update state to trigger debounced save
        setTopics(finalTopics);
        
        // Optionally update App Title if present in backup and user confirms?
        // For now, let's keep current title unless we want to force it. 
        // The prompt focused on *topics*. If we want to restore title, we could ask.
        // But usually "Restore Backup" implies full restore. Since we are doing partial,
        // let's stick to topics. If the user wants the title from backup, they can change it manually or we can update it if it was a full restore.
        if (restoreData.appTitle) {
             // Maybe only update if it was a full restore or just update it?
             // Let's leave appTitle as is to avoid confusion during partial restore.
             // OR: setAppTitle(restoreData.appTitle); if that's desired behavior. 
             // Given "which topics to load", imply merging content, not necessarily app settings.
        }

        setIsRestoreSummaryModalOpen(false);
        setRestoreData(null);

        alert(`${selectedTopics.length} konu başarıyla yüklendi/güncellendi!`);
        setCurrentView('home');
        
    } catch (error) {
        console.error("Geri yükleme sırasında state güncelleme hatası:", error);
        alert("Geri yükleme başarısız oldu.");
        setIsRestoreSummaryModalOpen(false);
        setRestoreData(null);
    }
};

const handleCancelRestore = () => {
    setIsRestoreSummaryModalOpen(false);
    setRestoreData(null);
};

const handleAddBulkQuestions = (topicId: string, newQuestions: Question[]) => {
    setTopics(prevTopics =>
      prevTopics.map(topic =>
        topic.id === topicId
          ? { ...topic, questions: [...topic.questions, ...newQuestions] }
          : topic
      )
    );
};

const handleReplaceQuestions = (topicId: string, newQuestions: Question[]) => {
    setTopics(prevTopics =>
        prevTopics.map(topic =>
            topic.id === topicId
                ? { ...topic, questions: newQuestions }
                : topic
        )
    );
};

const handleAddBulkFlashcards = (topicId: string, newCards: Array<Omit<Flashcard, 'id'>>) => {
    setTopics(prevTopics =>
      prevTopics.map(topic => {
        if (topic.id === topicId) {
          const newFlashcards = newCards.map((card, index) => ({
            ...card,
            id: Date.now() + index
          }));
          return { ...topic, flashcards: [...topic.flashcards, ...newFlashcards] };
        }
        return topic;
      })
    );
};

const handleUpdateBulkFlashcards = (topicId: string, newCards: Array<Omit<Flashcard, 'id'>>) => {
    setTopics(prevTopics =>
      prevTopics.map(topic => {
        if (topic.id === topicId) {
          const newFlashcards = newCards.map((card, index) => ({
            ...card,
            id: Date.now() + index
          }));
          return { ...topic, flashcards: newFlashcards };
        }
        return topic;
      })
    );
};


const handleEditFlashcard = (topicId: string, cardId: number, updatedCard: Omit<Flashcard, 'id'>) => {
    setTopics(prevTopics =>
      prevTopics.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            flashcards: topic.flashcards.map(card =>
              card.id === cardId ? { ...card, ...updatedCard } : card
            ),
          };
        }
        return topic;
      })
    );
};

const handleAddFlashcard = (topicId: string, newCardData: Omit<Flashcard, 'id'>) => {
  setTopics(prevTopics =>
    prevTopics.map(topic => {
      if(topic.id === topicId) {
        const newCard: Flashcard = {
          ...newCardData,
          id: Date.now(),
        };
        return { ...topic, flashcards: [...topic.flashcards, newCard] };
      }
      return topic;
    })
  )
}

const handleDeleteFlashcard = (topicId: string, cardId: number) => {
    setTopics(prevTopics =>
      prevTopics.map(topic => {
        if (topic.id === topicId) {
          return {
            ...topic,
            flashcards: topic.flashcards.filter(card => card.id !== cardId),
          };
        }
        return topic;
      })
    );
};

const handleSyncData = async () => {
    if (!window.confirm("Soru bankasını en güncel haliyle senkronize etmek istediğinizden emin misiniz? Bu işlem, mevcut konuların sorularını ve özetlerini günceller. Sizin eklediğiniz özel konular ve notlar korunacaktır.")) {
        return;
    }
    // This function will effectively re-run the migration logic
    localStorage.setItem('appDataVersion', '0'); // Force migration
    window.location.reload();
};

const handleUpdateAppTitle = (newTitle: string) => {
    setAppTitle(newTitle);
};

const handleUpdateMobileFontSize = (size: string) => {
  setMobileFontSize(size);
  localStorage.setItem('mobileFontSize', size);
};

const handleUpdateDesktopFontSize = (size: string) => {
  setDesktopFontSize(size);
  localStorage.setItem('desktopFontSize', size);
};


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-slate-400">Yükleniyor...</div>
      </div>
    );
  }

  const mainContent = () => {
    switch (currentView) {
      case 'topicSelection':
        return <TopicSelection 
                    topics={topics} 
                    onSelectTopic={handleOpenQuizConfigModal} // Open config modal first
                    onBack={handleBackToHome} 
                    onOpenAddQuestionModal={handleOpenAddQuestionModal}
                    onOpenViewQuestionsModal={handleOpenViewQuestionsModal}
                    onOpenEditTopicModal={handleOpenEditTopicModal}
                    onDeleteTopic={handleDeleteTopic}
                    onAddNewTopic={handleAddNewTopic}
                    onToggleFavorite={handleToggleFavorite}
                    availableIcons={availableIcons}
                    isMobileLayout={isMobileLayout}
                    onSyncData={handleSyncData}
                />;
      case 'quiz':
        return selectedTopic && <QuizView 
                                    topic={selectedTopic} 
                                    onQuizComplete={handleQuizComplete} 
                                    onBack={handleBackToTopics} 
                                    onBackToHome={handleBackToHome}
                                    onDeleteQuestion={handleDeleteQuestion}
                                    onEditQuestion={handleEditQuestion}
                                    isMobileLayout={isMobileLayout}
                                    onUpdateQuestionNote={handleUpdateQuestionNote}
                                    questionStates={quizHistory} // Pass quizHistory here
                                    mobileFontSize={mobileFontSize}
                                    desktopFontSize={desktopFontSize}
                                    mode={quizMode}
                                    examDuration={examDuration}
                                />;
      case 'results':
        return selectedTopic && <ResultsView 
                                    score={quizScore} 
                                    totalQuestions={selectedTopic.questions.length} 
                                    onBackToTopics={handleBackToTopics} 
                                    onBackToHome={handleBackToHome}
                                    isMobileLayout={isMobileLayout}
                                    previousScore={previousScore}
                                />;
      case 'summaries':
        return <SummariesView
                    onBack={handleBackToHome}
                    topics={topics}
                    onUpdateSummary={handleUpdateSummary}
                    onAddNewTopic={handleAddNewTopic}
                    onOpenEditTopicModal={handleOpenEditTopicModal}
                    onDeleteTopic={handleDeleteTopic}
                    onToggleFavorite={handleToggleFavorite}
                    availableIcons={availableIcons}
                    isMobileLayout={isMobileLayout}
                />;
      case 'bilgiKartlari':
        return <FlashcardsView 
                    onBack={handleBackToHome}
                    topics={topics}
                    isMobileLayout={isMobileLayout}
                    onEditFlashcard={handleEditFlashcard}
                    onDeleteFlashcard={handleDeleteFlashcard}
                    onAddNewTopic={handleAddNewTopic}
                    onOpenEditTopicModal={handleOpenEditTopicModal}
                    onDeleteTopic={handleDeleteTopic}
                    onToggleFavorite={handleToggleFavorite}
                    availableIcons={availableIcons}
                    onOpenBulkAddModal={(topic) => { setTopicForModal(topic); setIsBulkAddFlashcardsModalOpen(true); }}
                    onOpenBulkUpdateModal={(topic) => { setTopicForModal(topic); setIsBulkUpdateFlashcardsModalOpen(true); }}
                    onOpenManageCardsModal={(topic) => { setTopicForModal(topic); setIsManageFlashcardsModalOpen(true); }}
                />;
      case 'settings':
        return <SettingsView 
                    onBack={handleBackToHome}
                    topics={topics}
                    onEditQuestion={handleEditQuestion}
                    onDeleteQuestion={handleDeleteQuestion}
                    onAddNewQuestion={handleAddQuestion}
                    isMobileLayout={isMobileLayout}
                    onToggleMobileLayout={handleToggleMobileLayout}
                    onResetData={handleResetData}
                    onBackupData={handleBackupData}
                    onRestoreData={handleRestoreData}
                    onRestoreDefaultData={handleRestoreDefaultData}
                    appTitle={appTitle}
                    onUpdateAppTitle={handleUpdateAppTitle}
                    mobileFontSize={mobileFontSize}
                    desktopFontSize={desktopFontSize}
                    onUpdateMobileFontSize={handleUpdateMobileFontSize}
                    onUpdateDesktopFontSize={handleUpdateDesktopFontSize}
                />;
      case 'home':
      default:
        return <HomeSelection 
                    onSelectSorular={() => setCurrentView('topicSelection')} 
                    onSelectKonuOzetleri={() => setCurrentView('summaries')}
                    onSelectBilgiKartlari={() => setCurrentView('bilgiKartlari')}
                    onSelectAyarlar={() => setCurrentView('settings')}
                    onSelectDenemeSinavi={() => setIsExamConfigModalOpen(true)}
                    isMobileLayout={isMobileLayout}
                    appTitle={appTitle} // Pass appTitle to HomeSelection
                />;
    }
  };

  return (
    <div className={`container mx-auto ${isMobileLayout ? (currentView === 'quiz' ? 'p-0' : 'p-1') : 'p-4 md:p-8'} min-h-[100dvh] flex flex-col ${(isMobileLayout && currentView === 'quiz') ? 'justify-start pt-0' : 'justify-center'} ${isMobileLayout ? 'max-w-md' : 'max-w-5xl'}`}>
      <main className="w-full">
        {mainContent()}
      </main>
      {isAddQuestionModalOpen && topicForModal && (
        <AddQuestionModal
          topic={topicForModal}
          onClose={() => setIsAddQuestionModalOpen(false)}
          onAddQuestion={handleAddQuestion}
        />
      )}
      {isViewQuestionsModalOpen && topicForModal && (
        <ViewQuestionsModal
          topic={topicForModal}
          onClose={() => setIsViewQuestionsModalOpen(false)}
          onEditQuestion={(updatedQuestion) => handleEditQuestion(topicForModal.id, updatedQuestion)}
          onDeleteQuestion={(questionId) => handleDeleteQuestion(topicForModal.id, questionId)}
          onAddBulkQuestions={handleAddBulkQuestions}
          onReplaceQuestions={handleReplaceQuestions}
          onOpenAddQuestionModal={handleOpenAddQuestionModal}
        />
      )}
       {isEditTopicModalOpen && topicForModal && (
        <EditTopicModal
          topic={topicForModal}
          onClose={() => setIsEditTopicModalOpen(false)}
          onSave={handleSaveTopic}
          availableIcons={availableIcons}
          availableColorPalettes={availableColorPalettes}
        />
      )}
      {isBulkAddFlashcardsModalOpen && topicForModal && (
          <BulkAddFlashcardsModal
            topic={topicForModal}
            onClose={() => setIsBulkAddFlashcardsModalOpen(false)}
            onSave={handleAddBulkFlashcards}
          />
      )}
      {isBulkUpdateFlashcardsModalOpen && topicForModal && (
          <BulkUpdateFlashcardsModal
            topic={topicForModal}
            onClose={() => setIsBulkUpdateFlashcardsModalOpen(false)}
            onSave={handleUpdateBulkFlashcards}
          />
      )}
      {isManageFlashcardsModalOpen && topicForModal && (
          <ManageFlashcardsModal
            topic={topicForModal}
            onClose={() => setIsManageFlashcardsModalOpen(false)}
            onEditFlashcard={(cardId, updatedCard) => handleEditFlashcard(topicForModal.id, cardId, updatedCard)}
            onDeleteFlashcard={(cardId) => handleDeleteFlashcard(topicForModal.id, cardId)}
            onAddFlashcard={(newCardData) => handleAddFlashcard(topicForModal.id, newCardData)}
            onAddBulkFlashcards={handleAddBulkFlashcards}
          />
      )}
      {isRestoreSummaryModalOpen && restoreData && (
        <RestoreSummaryModal
          currentTopics={topics}
          restoredData={restoreData}
          onConfirm={handleConfirmRestore}
          onCancel={handleCancelRestore}
        />
      )}
      {isQuizConfigModalOpen && topicForQuizConfig && (
        <QuizConfigModal
          topic={topicForQuizConfig}
          onClose={() => {
            setIsQuizConfigModalOpen(false);
            setTopicForQuizConfig(null);
          }}
          onStartQuiz={handleSelectTopic}
        />
      )}
      {isExamConfigModalOpen && (
        <ExamConfigModal
          totalAvailableQuestions={topics.reduce((acc, t) => acc + t.questions.length, 0)}
          onClose={() => setIsExamConfigModalOpen(false)}
          onStartExam={handleStartExam}
        />
      )}
      <SaveStatusToast status={saveStatus} onIdle={onIdle} />
    </div>
  );
};

export default App;
