export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  tags: string[];
  createdAt: number;
  lastReviewed: number | null;
  nextReview: number | null;
  easeFactor: number; // SM2 algorithm parameter
  interval: number; // days
  repetitions: number; // count of successful reviews
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  lastStudied: number | null;
  cardCount: number;
}

export interface StudySession {
  id: string;
  deckId: string;
  startTime: number;
  endTime: number | null;
  cardsStudied: number;
  cardsCorrect: number;
}

export interface ReviewHistory {
  date: number;
  cardId: string;
  deckId: string;
  rating: number; // 0-5 rating
  timeSpent: number; // milliseconds
}

export type ConfidenceRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface UserStats {
  streakDays: number;
  totalReviews: number;
  averageRating: number;
  cardsLearned: number;
  lastStudyDate: number | null;
}

export interface StudyCardReview {
  cardId: string;
  startTime: number;
  rating: ConfidenceRating | null;
}