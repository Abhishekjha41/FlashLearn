import { Flashcard, ConfidenceRating } from '../types';

// Implementation of the SuperMemo 2 (SM2) algorithm
export const calculateNextReview = (
  card: Flashcard,
  rating: ConfidenceRating
): Omit<Flashcard, 'id' | 'front' | 'back' | 'deckId' | 'tags' | 'createdAt'> => {
  // SM2 algorithm constants
  const MIN_EASE_FACTOR = 1.3;
  
  // Initialize values for new cards
  let { easeFactor, interval, repetitions } = card;
  
  if (!easeFactor) easeFactor = 2.5;
  if (!interval) interval = 0;
  if (!repetitions) repetitions = 0;
  
  // Calculate new values based on rating
  if (rating < 3) {
    // If rating is less than 3, reset repetitions (failed recall)
    repetitions = 0;
    interval = 1;
  } else {
    // Successful recall
    repetitions += 1;
    
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    
    // Update ease factor based on performance
    easeFactor = Math.max(
      MIN_EASE_FACTOR,
      easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02))
    );
  }
  
  // Calculate next review date
  const now = Date.now();
  const nextReview = now + interval * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  
  return {
    lastReviewed: now,
    nextReview,
    easeFactor,
    interval,
    repetitions,
  };
};

export const getDueCards = (cards: Flashcard[], deckId?: string): Flashcard[] => {
  const now = Date.now();
  return cards.filter((card) => {
    const isDue = !card.nextReview || card.nextReview <= now;
    return isDue && (!deckId || card.deckId === deckId);
  });
};

export const getReviewStats = (cards: Flashcard[]): {
  dueToday: number;
  dueTomorrow: number;
  dueThisWeek: number;
  learned: number;
  new: number;
} => {
  const now = Date.now();
  const tomorrow = now + 24 * 60 * 60 * 1000;
  const nextWeek = now + 7 * 24 * 60 * 60 * 1000;

  return cards.reduce(
    (stats, card) => {
      if (!card.nextReview) {
        stats.new += 1;
      } else if (card.nextReview <= now) {
        stats.dueToday += 1;
      } else if (card.nextReview <= tomorrow) {
        stats.dueTomorrow += 1;
      } else if (card.nextReview <= nextWeek) {
        stats.dueThisWeek += 1;
      }

      if (card.repetitions > 0) {
        stats.learned += 1;
      }

      return stats;
    },
    { dueToday: 0, dueTomorrow: 0, dueThisWeek: 0, learned: 0, new: 0 }
  );
};

export const getCardStatus = (card: Flashcard): 'new' | 'learning' | 'review' | 'mastered' => {
  if (!card.lastReviewed) return 'new';
  if (card.repetitions < 2) return 'learning';
  if (card.interval < 30) return 'review';
  return 'mastered';
};