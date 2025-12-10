
import React from 'react';
import { QuestionState, Topic } from '../types'; // Import Topic interface
import LightbulbIcon from './icons/LightbulbIcon'; // Import LightbulbIcon

interface ProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  questionStates: QuestionState[]; 
  topic: Topic; // Add topic prop
  mode?: 'practice' | 'exam'; // Add mode prop
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentQuestionIndex, totalQuestions, questionStates, topic, mode = 'practice' }) => {
  // Ensure topic and topic.questions are defined before accessing
  const hasNoteForQuestion = (index: number) => {
    return !!topic?.questions?.[index]?.note;
  };

  const WINDOW_SIZE = 5;
  const start = Math.max(0, currentQuestionIndex - WINDOW_SIZE);
  const end = Math.min(totalQuestions, currentQuestionIndex + WINDOW_SIZE + 1);

  const indicesToRender = Array.from({ length: end - start }, (_, i) => start + i);

  const showStartEllipsis = start > 0;
  const showEndEllipsis = end < totalQuestions;

  return (
    <div className="w-full mb-0">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-sm font-semibold text-slate-400">
          Soru {currentQuestionIndex + 1}/{totalQuestions}
        </span>
        <div className="flex gap-1.5 items-center">
          {showStartEllipsis && (
            <span className="text-slate-500 tracking-widest text-xs" aria-hidden="true">...</span>
          )}
          {indicesToRender.map((index) => {
            const state = questionStates[index];
            if (!state) return null; // Safety check for array bounds
            return (
              <div
                key={index}
                className={`relative w-3 h-3 rounded-full transition-all duration-300 group
                  ${index === currentQuestionIndex ? 'ring-2 ring-cyan-400 scale-125' : ''}
                  ${!state.isAnswered ? 'bg-slate-700' : (state.isCorrect ? 'bg-green-500' : 'bg-red-500')}
                `}
                title={
                  !state.isAnswered
                    ? `Soru ${index + 1}: Yanıtlanmadı`
                    : state.isCorrect
                    ? `Soru ${index + 1}: Doğru`
                    : `Soru ${index + 1}: Yanlış`
                }
                aria-label={`Soru ${index + 1} durumu: ${
                  !state.isAnswered ? 'Yanıtlanmadı' : state.isCorrect ? 'Doğru' : 'Yanlış'
                }`}
              >
                {/* Hide hint/note indicator in exam mode */}
                {hasNoteForQuestion(index) && mode === 'practice' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <LightbulbIcon isActive={true} className="h-4 w-4 text-amber-300" />
                  </div>
                )}
              </div>
            );
          })}
          {showEndEllipsis && (
            <span className="text-slate-500 tracking-widest text-xs" aria-hidden="true">...</span>
          )}
        </div>
      </div>
      {/* Linear progress bar */}
      <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
        <div
          className="bg-cyan-400 h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
