import { Flashcard, Deck, StudySession, ReviewHistory, UserStats } from '../types';

// Local storage keys
const STORAGE_KEYS = {
  CARDS: 'flashcards',
  DECKS: 'decks',
  SESSIONS: 'study-sessions',
  HISTORY: 'review-history',
  STATS: 'user-stats',
};

// Helper to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Generic storage helpers
const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item from localStorage: ${error}`);
    return defaultValue;
  }
};

const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item in localStorage: ${error}`);
  }
};

// Flashcard CRUD operations
export const getFlashcards = (): Flashcard[] => {
  return getItem<Flashcard[]>(STORAGE_KEYS.CARDS, []);
};

export const saveFlashcard = (card: Omit<Flashcard, 'id' | 'createdAt'>): Flashcard => {
  const cards = getFlashcards();
  const newCard: Flashcard = {
    ...card,
    id: generateId(),
    createdAt: Date.now(),
    lastReviewed: null,
    nextReview: null,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
  };
  
  setItem(STORAGE_KEYS.CARDS, [...cards, newCard]);
  
  // Update card count for deck
  const decks = getDecks();
  const deckIndex = decks.findIndex(d => d.id === card.deckId);
  if (deckIndex >= 0) {
    decks[deckIndex].cardCount += 1;
    setItem(STORAGE_KEYS.DECKS, decks);
  }
  
  return newCard;
};

export const updateFlashcard = (updatedCard: Flashcard): void => {
  const cards = getFlashcards();
  const index = cards.findIndex(card => card.id === updatedCard.id);
  
  if (index !== -1) {
    cards[index] = updatedCard;
    setItem(STORAGE_KEYS.CARDS, cards);
  }
};

export const deleteFlashcard = (id: string): void => {
  const cards = getFlashcards();
  const cardToDelete = cards.find(card => card.id === id);
  
  if (cardToDelete) {
    const newCards = cards.filter(card => card.id !== id);
    setItem(STORAGE_KEYS.CARDS, newCards);
    
    // Update card count for deck
    const decks = getDecks();
    const deckIndex = decks.findIndex(d => d.id === cardToDelete.deckId);
    if (deckIndex >= 0) {
      decks[deckIndex].cardCount = Math.max(0, decks[deckIndex].cardCount - 1);
      setItem(STORAGE_KEYS.DECKS, decks);
    }
  }
};

// Deck CRUD operations
export const getDecks = (): Deck[] => {
  return getItem<Deck[]>(STORAGE_KEYS.DECKS, []);
};

export const saveDeck = (deck: Omit<Deck, 'id' | 'createdAt' | 'cardCount'>): Deck => {
  const decks = getDecks();
  const newDeck: Deck = {
    ...deck,
    id: generateId(),
    createdAt: Date.now(),
    lastStudied: null,
    cardCount: 0,
  };
  
  setItem(STORAGE_KEYS.DECKS, [...decks, newDeck]);
  return newDeck;
};

export const updateDeck = (updatedDeck: Deck): void => {
  const decks = getDecks();
  const index = decks.findIndex(deck => deck.id === updatedDeck.id);
  
  if (index !== -1) {
    decks[index] = updatedDeck;
    setItem(STORAGE_KEYS.DECKS, decks);
  }
};

export const deleteDeck = (id: string): void => {
  const decks = getDecks();
  const cards = getFlashcards();
  
  // Remove the deck
  setItem(STORAGE_KEYS.DECKS, decks.filter(deck => deck.id !== id));
  
  // Remove all cards in the deck
  setItem(STORAGE_KEYS.CARDS, cards.filter(card => card.deckId !== id));
};

// Study session operations
export const getStudySessions = (): StudySession[] => {
  return getItem<StudySession[]>(STORAGE_KEYS.SESSIONS, []);
};

export const startStudySession = (deckId: string): StudySession => {
  const sessions = getStudySessions();
  const newSession: StudySession = {
    id: generateId(),
    deckId,
    startTime: Date.now(),
    endTime: null,
    cardsStudied: 0,
    cardsCorrect: 0,
  };
  
  setItem(STORAGE_KEYS.SESSIONS, [...sessions, newSession]);
  return newSession;
};

export const endStudySession = (
  sessionId: string, 
  cardsStudied: number, 
  cardsCorrect: number
): void => {
  const sessions = getStudySessions();
  const index = sessions.findIndex(session => session.id === sessionId);
  
  if (index !== -1) {
    sessions[index] = {
      ...sessions[index],
      endTime: Date.now(),
      cardsStudied,
      cardsCorrect,
    };
    setItem(STORAGE_KEYS.SESSIONS, sessions);
    
    // Update last studied time for deck
    const decks = getDecks();
    const deckIndex = decks.findIndex(d => d.id === sessions[index].deckId);
    if (deckIndex >= 0) {
      decks[deckIndex].lastStudied = Date.now();
      setItem(STORAGE_KEYS.DECKS, decks);
    }
    
    // Update user stats
    updateUserStats();
  }
};

// Review history operations
export const getReviewHistory = (): ReviewHistory[] => {
  return getItem<ReviewHistory[]>(STORAGE_KEYS.HISTORY, []);
};

export const addReviewHistory = (review: Omit<ReviewHistory, 'date'>): void => {
  const history = getReviewHistory();
  const newReview: ReviewHistory = {
    ...review,
    date: Date.now(),
  };
  
  setItem(STORAGE_KEYS.HISTORY, [...history, newReview]);
};

// User stats operations
export const getUserStats = (): UserStats => {
  return getItem<UserStats>(STORAGE_KEYS.STATS, {
    streakDays: 0,
    totalReviews: 0,
    averageRating: 0,
    cardsLearned: 0,
    lastStudyDate: null,
  });
};

export const updateUserStats = (): void => {
  const history = getReviewHistory();
  const cards = getFlashcards();
  
  if (history.length === 0) return;
  
  // Calculate total reviews
  const totalReviews = history.length;
  
  // Calculate average rating
  const totalRating = history.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / totalReviews;
  
  // Count mastered cards
  const cardsLearned = cards.filter(card => card.repetitions > 0).length;
  
  // Calculate streak
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const today = currentDate.getTime();
  
  const lastStudyDate = Math.max(...history.map(h => h.date));
  
  // Check if user studied today
  const lastStudyDay = new Date(lastStudyDate);
  lastStudyDay.setHours(0, 0, 0, 0);
  const lastDay = lastStudyDay.getTime();
  
  // Get current streak
  const prevStats = getUserStats();
  let streakDays = prevStats.streakDays;
  
  if (lastDay === today) {
    // User studied today, check if they also studied yesterday
    const yesterday = today - 24 * 60 * 60 * 1000;
    
    if (prevStats.lastStudyDate === null) {
      streakDays = 1; // First day studying
    } else {
      const prevStudyDay = new Date(prevStats.lastStudyDate);
      prevStudyDay.setHours(0, 0, 0, 0);
      const prevDay = prevStudyDay.getTime();
      
      if (prevDay === yesterday) {
        // Continued streak
        streakDays += 1;
      } else if (prevDay < yesterday) {
        // Broken streak
        streakDays = 1;
      }
      // If prevDay === today, don't change streak
    }
  } else if (lastDay < today - 24 * 60 * 60 * 1000) {
    // More than a day since last study, reset streak
    streakDays = 0;
  }
  
  const updatedStats: UserStats = {
    streakDays,
    totalReviews,
    averageRating,
    cardsLearned,
    lastStudyDate: lastStudyDate,
  };
  
  setItem(STORAGE_KEYS.STATS, updatedStats);
};

// Data export/import
export const exportData = (): string => {
  const data = {
    cards: getFlashcards(),
    decks: getDecks(),
    sessions: getStudySessions(),
    history: getReviewHistory(),
    stats: getUserStats(),
  };
  
  return JSON.stringify(data);
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.cards) setItem(STORAGE_KEYS.CARDS, data.cards);
    if (data.decks) setItem(STORAGE_KEYS.DECKS, data.decks);
    if (data.sessions) setItem(STORAGE_KEYS.SESSIONS, data.sessions);
    if (data.history) setItem(STORAGE_KEYS.HISTORY, data.history);
    if (data.stats) setItem(STORAGE_KEYS.STATS, data.stats);
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};