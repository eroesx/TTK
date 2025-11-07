import React, { useState, useEffect, useCallback } from 'react';
import type { Topic, Question, Flashcard } from './types';
import { availableIcons, availableColorPalettes, DATA_VERSION, quizData } from './data/quizData';
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

type View = 'home' | 'topicSelection' | 'quiz' | 'results' | 'summaries' | 'bilgiKartlari' | 'settings';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [initialTopics, setInitialTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const initializeAppData = () => {
      try {
        const { topicNames, summariesData, questionsData } = quizData;

        const generatedInitialTopics: Topic[] = topicNames.map((name: string, index: number) => {
          const id = name.toLowerCase()
            .replace(/ /g, '-')
            .replace(/ı/g, 'i')
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9-]/g, '');

          return {
            id: `${id}-${index}`,
            name: name,
            iconName: availableIcons[index % availableIcons.length].name,
            color: availableColorPalettes[index % availableColorPalettes.length].color,
            bgColor: availableColorPalettes[index % availableColorPalettes.length].bgColor,
            questions: questionsData[index] || [],
            summary: summariesData[index] || '',
            flashcards: [],
            isFavorite: false,
          };
        });

        setInitialTopics(generatedInitialTopics);
        
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
              const savedVersionOfTopic = savedTopics.find((t: Topic) => t.id === initialTopic.id);
              if (savedVersionOfTopic) {
                return {
                  ...initialTopic,
                  summary: savedVersionOfTopic.summary,
                  flashcards: savedVersionOfTopic.flashcards,
                  isFavorite: savedVersionOfTopic.isFavorite,
                };
              }
              return initialTopic;
            });
            
            finalTopics = [...migratedTopics, ...userTopics];

            localStorage.setItem('appTopics', JSON.stringify(finalTopics));
            localStorage.setItem('appDataVersion', String(DATA_VERSION));
          } else {
            finalTopics = savedTopics;
          }
        } else {
          localStorage.setItem('appDataVersion', String(DATA_VERSION));
          finalTopics = generatedInitialTopics;
        }
        setTopics(finalTopics);
      } catch (error) {
        console.error("Uygulama verileri yüklenirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAppData();
  }, []);

  const [isMobileLayout, setIsMobileLayout] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('isMobileLayout');
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error("Mobil arayüz ayarı okunurken hata oluştu:", error);
      return false;
    }
  });

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [previousScore, setPreviousScore] = useState<number | undefined>(undefined);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [topicToAddTo, setTopicToAddTo] = useState<Topic | null>(null);
  const [isViewQuestionsModalOpen, setIsViewQuestionsModalOpen] = useState(false);
  const [topicToViewQuestions, setTopicToViewQuestions] = useState<Topic | null>(null);
  const [isEditTopicModalOpen, setIsEditTopicModalOpen] = useState(false);
  const [topicToEdit, setTopicToEdit] = useState<Topic | null>(null);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [topicToBulkAddTo, setTopicToBulkAddTo] = useState<Topic | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  const saveTopics = useCallback((newTopics: Topic[]) => {
    setSaveStatus('saving');
    try {
      localStorage.setItem('appTopics', JSON.stringify(newTopics));
      setSaveStatus('saved');
    } catch (error) {
      console.error("Konular kaydedilirken hata oluştu:", error);
      setSaveStatus('error');
    }
  }, []);


  useEffect(() => {
    if (selectedTopic && !selectedTopic.originalId) { // Do not update if it's a shuffled quiz
      const updatedTopic = topics.find(t => t.id === selectedTopic.id);
      if (updatedTopic) {
        setSelectedTopic(updatedTopic);
      } else {
        setSelectedTopic(null);
        setCurrentView('topicSelection');
      }
    }
  }, [topics, selectedTopic?.id]);
  
  const handleToggleMobileLayout = useCallback(() => {
    setIsMobileLayout(prev => {
        const newValue = !prev;
        localStorage.setItem('isMobileLayout', JSON.stringify(newValue));
        return newValue;
    });
  }, []);
  
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleTopicSelect = (topic: Topic, shuffle: boolean) => {
     if (shuffle) {
      const shuffledQuestions = shuffleArray(topic.questions).map(q => {
        const correctAnswerValue = q.options[q.correctAnswerIndex];
        const shuffledOptions = shuffleArray(q.options);
        const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctAnswerValue);
        return {
          ...q,
          options: shuffledOptions,
          correctAnswerIndex: newCorrectIndex,
        };
      });
      
      const shuffledTopic: Topic = {
        ...topic,
        id: `shuffled-${topic.id}`,
        originalId: topic.id, // Keep track of the original
        questions: shuffledQuestions,
      };
      setSelectedTopic(shuffledTopic);
    } else {
      setSelectedTopic(topic);
    }
    setCurrentView('quiz');
  };

  const handleQuizComplete = (score: number) => {
    setFinalScore(score);

    if (selectedTopic) {
        const topicId = selectedTopic.originalId || selectedTopic.id;
        try {
            const scoresHistory = JSON.parse(localStorage.getItem('quizScoresHistory') || '{}');
            const prevScore = scoresHistory[topicId];
            setPreviousScore(prevScore); 

            const newPercentage = selectedTopic.questions.length > 0 ? Math.round((score / selectedTopic.questions.length) * 100) : 0;
            scoresHistory[topicId] = newPercentage;
            localStorage.setItem('quizScoresHistory', JSON.stringify(scoresHistory));
        } catch (error) {
            console.error("Skor geçmişi işlenirken hata oluştu:", error);
            setPreviousScore(undefined);
        }
    }
    
    setCurrentView('results');
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setCurrentView('topicSelection');
    setFinalScore(0);
    setPreviousScore(undefined);
  };

  const handleBackToHome = () => {
    setSelectedTopic(null);
    setCurrentView('home');
    setFinalScore(0);
    setPreviousScore(undefined);
  };
  
  const handleOpenAddQuestionModal = useCallback((topic: Topic) => {
    setTopicToAddTo(topic);
    setIsAddQuestionModalOpen(true);
  }, []);

  const handleCloseAddQuestionModal = useCallback(() => {
    setTopicToAddTo(null);
    setIsAddQuestionModalOpen(false);
  }, []);

  const handleAddNewQuestion = useCallback((topicId: string, newQuestion: Question) => {
    setTopics(currentTopics => {
      const newTopics = currentTopics.map(topic => {
        if (topic.id === topicId) {
          const updatedQuestions = [...topic.questions, newQuestion];
          return { ...topic, questions: updatedQuestions };
        }
        return topic;
      });
      saveTopics(newTopics);
      return newTopics;
    });
  }, [saveTopics]);

  const handleAddNewBulkQuestions = useCallback((topicId: string, newQuestions: Question[]) => {
    setTopics(currentTopics => {
      const newTopics = currentTopics.map(topic => {
        if (topic.id === topicId) {
          const updatedQuestions = [...topic.questions, ...newQuestions];
          return { ...topic, questions: updatedQuestions };
        }
        return topic;
      });
      saveTopics(newTopics);
      return newTopics;
    });
  }, [saveTopics]);
  
  const handleEditQuestion = useCallback((topicId: string, updatedQuestion: Question) => {
    setTopics(currentTopics => {
      const newTopics = currentTopics.map(topic => {
        if (topic.id === topicId) {
          const updatedQuestions = topic.questions.map(q => 
            q.id === updatedQuestion.id ? updatedQuestion : q
          );
          return { ...topic, questions: updatedQuestions };
        }
        return topic;
      });
      saveTopics(newTopics);
      return newTopics;
    });
  }, [saveTopics]);

  const handleDeleteQuestion = useCallback((topicId: string, questionId: number) => {
    setTopics(currentTopics => {
      const newTopics = currentTopics.map(topic => {
        if (topic.id === topicId) {
          const updatedQuestions = topic.questions.filter(q => q.id !== questionId);
          return { ...topic, questions: updatedQuestions };
        }
        return topic;
      });
      saveTopics(newTopics);
      return newTopics;
    });
  }, [saveTopics]);

  const handleOpenViewQuestionsModal = useCallback((topic: Topic) => {
    setTopicToViewQuestions(topic);
    setIsViewQuestionsModalOpen(true);
  }, []);

  const handleCloseViewQuestionsModal = useCallback(() => {
    setTopicToViewQuestions(null);
    setIsViewQuestionsModalOpen(false);
  }, []);

  const handleOpenEditTopicModal = useCallback((topic: Topic) => {
    setTopicToEdit(topic);
    setIsEditTopicModalOpen(true);
  }, []);
  
  const handleOpenAddTopicModal = useCallback(() => {
    const newTopicTemplate: Topic = {
        id: `topic-${Date.now()}`,
        name: '',
        iconName: availableIcons[0].name,
        questions: [],
        color: availableColorPalettes[0].color,
        bgColor: availableColorPalettes[0].bgColor,
        summary: '',
        flashcards: [],
        isFavorite: false,
    };
    setTopicToEdit(newTopicTemplate);
    setIsEditTopicModalOpen(true);
  }, []);

  const handleCloseEditTopicModal = useCallback(() => {
    setTopicToEdit(null);
    setIsEditTopicModalOpen(false);
  }, []);

  const handleSaveTopic = useCallback((topicToSave: Topic) => {
    setTopics(currentTopics => {
        const topicExists = currentTopics.some(t => t.id === topicToSave.id);
        let newTopics;
        if (topicExists) {
            newTopics = currentTopics.map(topic => 
                topic.id === topicToSave.id ? topicToSave : topic
            );
        } else {
            newTopics = [...currentTopics, topicToSave];
        }
        saveTopics(newTopics);
        return newTopics;
    });
    if (selectedTopic && selectedTopic.id === topicToSave.id) {
      setSelectedTopic(topicToSave);
    }
    handleCloseEditTopicModal();
  }, [selectedTopic, handleCloseEditTopicModal, saveTopics]);
  
  const handleUpdateSummary = useCallback((topicId: string, newSummary: string) => {
    setTopics(currentTopics => {
      const newTopics = currentTopics.map(topic => {
        if (topic.id === topicId) {
          return { ...topic, summary: newSummary };
        }
        return topic;
      });
      saveTopics(newTopics);
      return newTopics;
    });
  }, [saveTopics]);

  const handleDeleteTopic = useCallback((topicId: string) => {
    if (window.confirm("Bu konuyu ve tüm içeriğini (sorular, bilgi kartları, özet) silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      setTopics(currentTopics => {
        const newTopics = currentTopics.filter(topic => topic.id !== topicId);
        saveTopics(newTopics);
        return newTopics;
      });
      if (selectedTopic && selectedTopic.id === topicId) {
        setSelectedTopic(null);
        setCurrentView('topicSelection');
      }
    }
  }, [selectedTopic, saveTopics]);

  const handleToggleFavorite = useCallback((topicId: string) => {
    setTopics(currentTopics => {
        const newTopics = currentTopics.map(topic =>
            topic.id === topicId ? { ...topic, isFavorite: !topic.isFavorite } : topic
        );
        saveTopics(newTopics);
        return newTopics;
    });
  }, [saveTopics]);
  
  const handleEditFlashcard = useCallback((topicId: string, cardId: number, updatedCard: Omit<Flashcard, 'id'>) => {
      setTopics(currentTopics => {
          const newTopics = currentTopics.map(topic => {
              if (topic.id === topicId) {
                  const updatedFlashcards = topic.flashcards.map(card => 
                      card.id === cardId ? { ...card, ...updatedCard } : card
                  );
                  return { ...topic, flashcards: updatedFlashcards };
              }
              return topic;
          });
          saveTopics(newTopics);
          return newTopics;
      });
  }, [saveTopics]);

  const handleDeleteFlashcard = useCallback((topicId: string, cardId: number) => {
      setTopics(currentTopics => {
        const newTopics = currentTopics.map(topic => {
            if (topic.id === topicId) {
                const updatedFlashcards = topic.flashcards.filter(card => card.id !== cardId);
                return { ...topic, flashcards: updatedFlashcards };
            }
            return topic;
        });
        saveTopics(newTopics);
        return newTopics;
      });
  }, [saveTopics]);

  const handleOpenBulkAddModal = useCallback((topic: Topic) => {
    setTopicToBulkAddTo(topic);
    setIsBulkAddModalOpen(true);
  }, []);

  const handleCloseBulkAddModal = useCallback(() => {
    setTopicToBulkAddTo(null);
    setIsBulkAddModalOpen(false);
  }, []);

  const handleBulkAddFlashcards = useCallback((topicId: string, newCards: Array<Omit<Flashcard, 'id'>>) => {
    setTopics(currentTopics => {
      const newTopics = currentTopics.map(topic => {
        if (topic.id === topicId) {
          const existingCards = topic.flashcards;
          const lastId = existingCards.length > 0 ? Math.max(...existingCards.map(c => c.id)) : 0;
          const newFlashcardsWithIds = newCards.map((card, index) => ({
            ...card,
            id: lastId + index + 1,
          }));
          const finalFlashcards = [...existingCards, ...newFlashcardsWithIds];
          return { ...topic, flashcards: finalFlashcards };
        }
        return topic;
      });
      saveTopics(newTopics);
      return newTopics;
    });
  }, [saveTopics]);
  
  const handleResetData = useCallback(() => {
    if (window.confirm("Tüm değişiklikleri sıfırlamak ve başlangıç verilerine dönmek istediğinizden emin misiniz? Eklediğiniz tüm konular, sorular ve diğer veriler silinecektir.")) {
      try {
        localStorage.removeItem('appTopics');
        localStorage.removeItem('quizScoresHistory');
        localStorage.removeItem('appDataVersion');
        setTopics(initialTopics);
        setCurrentView('home');
        alert("Uygulama verileri başarıyla sıfırlandı.");
      } catch (error) {
        console.error("Veri sıfırlanırken hata oluştu:", error);
        alert("Veri sıfırlanırken bir hata oluştu.");
      }
    }
  }, [initialTopics]);

  const handleSyncData = useCallback(() => {
    if (window.confirm("Bu işlem, mevcut soru bankanızı uygulamanın orijinal haliyle güncelleyecektir. Kendi eklediğiniz veya düzenlediğiniz sorular silinecektir. Test skoru geçmişiniz korunacaktır. Devam etmek istiyor musunuz?")) {
      try {
        const currentDataMap = new Map<string, { summary: string; flashcards: Flashcard[] }>();
        topics.forEach(topic => {
          currentDataMap.set(topic.id, { summary: topic.summary, flashcards: topic.flashcards });
        });

        const syncedTopics = initialTopics.map(initialTopic => {
          const currentData = currentDataMap.get(initialTopic.id);
          return {
            ...initialTopic,
            summary: currentData ? currentData.summary : initialTopic.summary,
            flashcards: currentData ? currentData.flashcards : initialTopic.flashcards,
            isFavorite: topics.find(t => t.id === initialTopic.id)?.isFavorite || false
          };
        });

        setTopics(syncedTopics);
        saveTopics(syncedTopics);
        alert("Soru bankası başarıyla güncellendi.");
      } catch (error) {
        console.error("Veri senkronize edilirken hata oluştu:", error);
        alert("Veri senkronize edilirken bir hata oluştu.");
      }
    }
  }, [topics, saveTopics, initialTopics]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <svg className="animate-spin h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-lg">Veriler Yükleniyor...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'quiz':
        return selectedTopic && <QuizView 
            topic={selectedTopic} 
            onQuizComplete={handleQuizComplete} 
            onBack={handleBackToTopics} 
            onBackToHome={handleBackToHome} 
            onDeleteQuestion={handleDeleteQuestion}
            onEditQuestion={handleEditQuestion}
            isMobileLayout={isMobileLayout} />;
      case 'results':
        return selectedTopic && <ResultsView 
            score={finalScore} 
            totalQuestions={selectedTopic.questions.length} 
            onBackToTopics={handleBackToTopics} 
            onBackToHome={handleBackToHome} 
            isMobileLayout={isMobileLayout} 
            previousScore={previousScore}
        />;
      case 'topicSelection':
        return <TopicSelection 
            topics={topics} 
            onSelectTopic={handleTopicSelect} 
            onBack={handleBackToHome} 
            onOpenAddQuestionModal={handleOpenAddQuestionModal} 
            onOpenViewQuestionsModal={handleOpenViewQuestionsModal}
            onOpenEditTopicModal={handleOpenEditTopicModal}
            onDeleteTopic={handleDeleteTopic}
            onAddNewTopic={handleOpenAddTopicModal}
            onToggleFavorite={handleToggleFavorite}
            availableIcons={availableIcons}
            isMobileLayout={isMobileLayout}
            onSyncData={handleSyncData}
        />;
      case 'summaries':
        return <SummariesView 
                    onBack={handleBackToHome} 
                    topics={topics} 
                    onUpdateSummary={handleUpdateSummary}
                    onAddNewTopic={handleOpenAddTopicModal}
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
            onAddNewTopic={handleOpenAddTopicModal}
            onOpenEditTopicModal={handleOpenEditTopicModal}
            onDeleteTopic={handleDeleteTopic}
            onToggleFavorite={handleToggleFavorite}
            availableIcons={availableIcons}
            onOpenBulkAddModal={handleOpenBulkAddModal}
        />;
      case 'settings':
        return <SettingsView 
            onBack={handleBackToHome} 
            topics={topics}
            onEditQuestion={handleEditQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onAddNewQuestion={handleAddNewQuestion}
            isMobileLayout={isMobileLayout}
            onToggleMobileLayout={handleToggleMobileLayout}
            onResetData={handleResetData}
        />;
      case 'home':
      default:
        return <HomeSelection 
            onSelectSorular={() => setCurrentView('topicSelection')}
            onSelectKonuOzetleri={() => setCurrentView('summaries')}
            onSelectBilgiKartlari={() => setCurrentView('bilgiKartlari')}
            onSelectAyarlar={() => setCurrentView('settings')}
            isMobileLayout={isMobileLayout}
        />;
    }
  };
  
  const backgroundClass = currentView === 'bilgiKartlari' 
    ? 'bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900' 
    : 'bg-slate-900';


  return (
    <div className={`min-h-screen ${backgroundClass} flex flex-col items-center justify-center p-4 transition-colors duration-500`}>
      <main className={`w-full ${isMobileLayout ? 'max-w-md' : 'max-w-4xl'} mx-auto`}>
        {renderContent()}
      </main>
      <SaveStatusToast status={saveStatus} onIdle={() => setSaveStatus('idle')} />
      {isAddQuestionModalOpen && topicToAddTo && (
        <AddQuestionModal 
          topic={topicToAddTo}
          onClose={handleCloseAddQuestionModal}
          onAddQuestion={handleAddNewQuestion}
        />
      )}
      {isViewQuestionsModalOpen && topicToViewQuestions && (
        <ViewQuestionsModal
            topic={topicToViewQuestions}
            onClose={handleCloseViewQuestionsModal}
            onEditQuestion={(updatedQuestion) => handleEditQuestion(topicToViewQuestions.id, updatedQuestion)}
            onDeleteQuestion={(questionId) => handleDeleteQuestion(topicToViewQuestions.id, questionId)}
            onAddBulkQuestions={handleAddNewBulkQuestions}
        />
      )}
      {isEditTopicModalOpen && topicToEdit && (
        <EditTopicModal
          topic={topicToEdit}
          onClose={handleCloseEditTopicModal}
          onSave={handleSaveTopic}
          availableIcons={availableIcons}
          availableColorPalettes={availableColorPalettes}
        />
      )}
      {isBulkAddModalOpen && topicToBulkAddTo && (
        <BulkAddFlashcardsModal
            topic={topicToBulkAddTo}
            onClose={handleCloseBulkAddModal}
            onSave={handleBulkAddFlashcards}
        />
      )}
    </div>
  );
};

export default App;