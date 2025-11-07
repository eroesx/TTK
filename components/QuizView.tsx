import React, { useState, useEffect } from 'react';
import type { QuizViewProps, Question } from '../types'; // Import Question
import ProgressBar from './ProgressBar';
import TrashIcon from './icons/TrashIcon';
import CorrectIcon from './icons/CorrectIcon';
import IncorrectIcon from './icons/IncorrectIcon';
import EditIcon from './icons/EditIcon';
import EditQuestionModal from './EditQuestionModal'; // Import the new modal

const QuizView: React.FC<QuizViewProps> = ({ topic, onQuizComplete, onBack, onBackToHome, onDeleteQuestion, onEditQuestion, isMobileLayout }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const isShuffledQuiz = !!topic.originalId || topic.id.startsWith('shuffled-'); // More robust check
  const currentQuestion = topic.questions[currentQuestionIndex];
  
  useEffect(() => {
    // This effect handles navigation if the current question is deleted
    if (currentQuestionIndex >= topic.questions.length && topic.questions.length > 0) {
      setCurrentQuestionIndex(topic.questions.length - 1);
    }
  }, [topic.questions, currentQuestionIndex]);


  useEffect(() => {
    setSelectedAnswerIndex(null);
    setIsAnswered(false);
    setAnswerStatus(null);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [currentQuestionIndex]);

  const proceedToNextStep = () => {
    if (currentQuestionIndex < topic.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // This is called when user clicks on "Incorrect" banner on the last question.
      // The score state is correct here as no increment is needed.
      onQuizComplete(score);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return;

    // Blur the button on selection to fix mobile focus issue
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setSelectedAnswerIndex(index);
    setIsAnswered(true);
    let newScore = score;

    if (index === currentQuestion.correctAnswerIndex) {
      newScore = score + 1;
      setScore(newScore);
      setAnswerStatus('correct');
      
      setTimeout(() => {
        if (currentQuestionIndex < topic.questions.length - 1) {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
          onQuizComplete(newScore);
        }
      }, 1500); 
    } else {
      setAnswerStatus('incorrect');
    }
  };
  
  const handleDelete = () => {
      if (isShuffledQuiz) return;
      if (window.confirm("Bu soruyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
          const originalTopicId = topic.id;
          onDeleteQuestion(originalTopicId, currentQuestion.id);
      }
  };

  // Renamed and updated to handle the full question object
  const handleSaveQuestion = (updatedQuestion: Question) => {
    if (isShuffledQuiz) return;
    if (currentQuestion) {
      const originalTopicId = topic.id;
      onEditQuestion(originalTopicId, updatedQuestion);
    }
    setIsEditModalOpen(false);
  };

  const getButtonClass = (index: number) => {
    if (!isAnswered) {
      return 'bg-slate-800 hover:bg-slate-700';
    }
    if (index === currentQuestion.correctAnswerIndex) {
      return 'bg-green-600/90 border-green-400';
    }
    if (index === selectedAnswerIndex) {
      return 'bg-red-600/90 border-red-400';
    }
    return 'bg-slate-800 opacity-50'; // Unselected incorrect options
  };
  
  if (!currentQuestion) {
    return (
      <div className="relative bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-2xl w-full animate-fade-in text-center">
        <p className="text-white text-xl">Bu konu için soru bulunmuyor.</p>
        <button onClick={onBack} className="mt-4 px-6 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 font-semibold transition-colors">Geri Dön</button>
      </div>
    );
  }

  return (
    <div className="relative bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-2xl w-full animate-fade-in">
       <button onClick={onBack} aria-label="Konu seçimine geri dön" className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors duration-200 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button onClick={onBackToHome} aria-label="Ana menüye geri dön" className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors duration-200 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>

      <div className="text-center mb-4 pt-8">
        <h2 className="text-xl font-bold text-cyan-400">{topic.name}</h2>
      </div>

      <ProgressBar current={currentQuestionIndex + 1} total={topic.questions.length} />

      <div className="relative mt-8 text-center group">
        {isAnswered && (
            <div
                onClick={answerStatus === 'incorrect' ? proceedToNextStep : undefined}
                className={`inline-block mx-auto py-1 px-3 rounded-lg text-center shadow-md transition-all duration-300 transform animate-fade-in mb-4 ${
                answerStatus === 'correct'
                    ? 'bg-green-500'
                    : 'bg-red-500 cursor-pointer hover:bg-red-400'
                }`}
            >
                <div className="text-xs font-semibold text-white flex items-center justify-center gap-1.5">
                {answerStatus === 'correct' ? (
                    <>
                    <CorrectIcon className="h-4 w-4" />
                    <span>Doğru!</span>
                    </>
                ) : (
                    <>
                    <IncorrectIcon className="h-4 w-4" />
                    <span>Yanlış! (Devam etmek için tıkla)</span>
                    </>
                )}
                </div>
            </div>
        )}
        <p className={`${isMobileLayout ? 'text-lg' : 'text-xl md:text-2xl'} text-white font-medium min-h-[6rem] flex items-center justify-center px-4`}>
          {currentQuestion.questionText}
        </p>
        {!isShuffledQuiz && (
            <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-1/2 -right-4 -translate-y-1/2 p-2 rounded-full text-slate-400 bg-slate-700/80 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                aria-label="Soruyu düzenle"
                title="Soruyu düzenle"
            >
                <EditIcon />
            </button>
        )}
      </div>

      <div className={`mt-8 grid ${isMobileLayout ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={isAnswered}
            className={`relative w-full p-4 rounded-lg border-2 border-transparent text-left transition-all duration-300 ${getButtonClass(index)}`}
          >
            <span className="font-semibold pr-10">{option}</span>
            {isAnswered && (
                <>
                {index === currentQuestion.correctAnswerIndex && (
                    <div className="absolute bottom-2 right-2 flex items-center justify-center h-6 w-6 rounded-full bg-green-500/80">
                    <CorrectIcon />
                    </div>
                )}
                {index !== currentQuestion.correctAnswerIndex && (
                    <div className="absolute bottom-2 right-2 flex items-center justify-center h-6 w-6 rounded-full bg-red-500/80">
                    <IncorrectIcon />
                    </div>
                )}
                </>
            )}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-6">
          {!isShuffledQuiz ? (
            <button 
                onClick={handleDelete}
                className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                title="Soruyu Sil"
            >
                <TrashIcon />
            </button>
          ) : (
            <div></div> // Placeholder to keep layout consistent
          )}
          <span className="text-sm font-semibold text-slate-400">
              Soru {currentQuestionIndex + 1}/{topic.questions.length}
          </span>
      </div>
      {/* Use the new modal */}
      {isEditModalOpen && currentQuestion && (
        <EditQuestionModal
          question={currentQuestion}
          onSave={handleSaveQuestion}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default QuizView;