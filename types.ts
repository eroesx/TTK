import React from 'react';

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Topic {
  id: string;
  name: string;
  iconName: string;
  questions: Question[];
  color: string;
  bgColor: string;
  summary: string;
  flashcards: Flashcard[];
  isFavorite?: boolean;
  originalId?: string; // Used to track the original topic for shuffled quizzes
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
}

// Props for components that need to adapt to mobile layout
export interface MobileLayoutProps {
  isMobileLayout: boolean;
}

export interface HomeSelectionProps extends MobileLayoutProps {
  onSelectSorular: () => void;
  onSelectKonuOzetleri: () => void;
  onSelectBilgiKartlari: () => void;
  onSelectAyarlar: () => void;
}

export interface TopicSelectionProps extends MobileLayoutProps {
  topics: Topic[];
  onSelectTopic: (topic: Topic, shuffle: boolean) => void;
  onBack: () => void;
  onOpenAddQuestionModal: (topic: Topic) => void;
  onOpenViewQuestionsModal: (topic: Topic) => void;
  onOpenEditTopicModal: (topic: Topic) => void;
  onDeleteTopic: (topicId: string) => void;
  onAddNewTopic: () => void;
  onToggleFavorite: (topicId: string) => void;
  availableIcons: { name: string, component: React.ReactNode }[];
  onSyncData: () => void;
}

export interface ViewQuestionsModalProps {
  topic: Topic;
  onClose: () => void;
  onEditQuestion: (updatedQuestion: Question) => void;
  onDeleteQuestion: (questionId: number) => void;
  onAddBulkQuestions: (topicId: string, newQuestions: Question[]) => void;
}


export interface QuizViewProps extends MobileLayoutProps {
  topic: Topic;
  onQuizComplete: (score: number) => void;
  onBack: () => void;
  onBackToHome: () => void;
  onDeleteQuestion: (topicId: string, questionId: number) => void;
  onEditQuestion: (topicId: string, updatedQuestion: Question) => void;
}

export interface ResultsViewProps extends MobileLayoutProps {
  score: number;
  totalQuestions: number;
  onBackToTopics: () => void;
  onBackToHome: () => void;
  previousScore?: number;
}

export interface FlashcardsViewProps extends MobileLayoutProps {
    onBack: () => void;
    topics: Topic[];
    onEditFlashcard: (topicId: string, cardId: number, updatedCard: Omit<Flashcard, 'id'>) => void;
    onDeleteFlashcard: (topicId: string, cardId: number) => void;
    onAddNewTopic: () => void;
    onOpenEditTopicModal: (topic: Topic) => void;
    onDeleteTopic: (topicId: string) => void;
    onToggleFavorite: (topicId: string) => void;
    availableIcons: { name: string, component: React.ReactNode }[];
    onOpenBulkAddModal: (topic: Topic) => void;
}

export interface SummariesViewProps extends MobileLayoutProps {
  onBack: () => void;
  topics: Topic[];
  onUpdateSummary: (topicId: string, newSummary: string) => void;
  onAddNewTopic: () => void;
  onOpenEditTopicModal: (topic: Topic) => void;
  onDeleteTopic: (topicId: string) => void;
  onToggleFavorite: (topicId: string) => void;
  availableIcons: { name: string, component: React.ReactNode }[];
}


export interface SettingsViewProps {
  onBack: () => void;
  topics: Topic[];
  onEditQuestion: (topicId: string, updatedQuestion: Question) => void;
  onDeleteQuestion: (topicId: string, questionId: number) => void;
  onAddNewQuestion: (topicId: string, newQuestion: Question) => void;
  isMobileLayout: boolean;
  onToggleMobileLayout: () => void;
  onResetData: () => void;
}