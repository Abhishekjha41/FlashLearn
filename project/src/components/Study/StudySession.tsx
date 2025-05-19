import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, X } from 'lucide-react';
import { Flashcard, ConfidenceRating, StudyCardReview } from '../../types';
import FlashCard from '../Card/FlashCard';
import { calculateNextReview } from '../../utils/sm2';
import { updateFlashcard, addReviewHistory, startStudySession, endStudySession } from '../../utils/storage';

interface StudySessionProps {
  deckId: string;
  cards: Flashcard[];
  onComplete: () => void;
}

const StudySession: React.FC<StudySessionProps> = ({ deckId, cards, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studiedCards, setStudiedCards] = useState<StudyCardReview[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [showSummary, setShowSummary] = useState(false);
  const [summaryStats, setSummaryStats] = useState({
    totalCards: 0,
    correct: 0,
    timeSpent: 0,
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Start a new study session
    if (cards.length > 0) {
      const session = startStudySession(deckId);
      setSessionId(session.id);
      setStudiedCards([]);
    }
    
    return () => {
      // Clean up if component unmounts before completion
      if (sessionId && studiedCards.length > 0 && !showSummary) {
        endSession();
      }
    };
  }, [deckId]);

  const handleRate = (rating: ConfidenceRating) => {
    if (currentIndex >= cards.length) return;
    
    const currentCard = cards[currentIndex];
    
    // Update the card with new SM2 parameters
    const updatedCardParams = calculateNextReview(currentCard, rating);
    const updatedCard = {
      ...currentCard,
      ...updatedCardParams,
    };
    
    // Save card updates to storage
    updateFlashcard(updatedCard);
    
    // Record the rating
    const cardReview = studiedCards[currentIndex] || {
      cardId: currentCard.id,
      startTime: Date.now(),
      rating: null,
    };
    
    const timeSpent = Date.now() - cardReview.startTime;
    
    // Add to review history
    addReviewHistory({
      cardId: currentCard.id,
      deckId: currentCard.deckId,
      rating: rating,
      timeSpent,
    });
    
    // Update studied cards state
    const newStudiedCards = [...studiedCards];
    newStudiedCards[currentIndex] = {
      ...cardReview,
      rating,
    };
    setStudiedCards(newStudiedCards);
    
    // Move to next card or finish
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      endSession();
    }
  };

  const endSession = () => {
    if (!sessionId) return;
    
    // Count correct answers (rating >= 3)
    const correctCards = studiedCards.filter(card => card.rating !== null && card.rating >= 3);
    
    // Calculate time spent
    const startTime = Math.min(...studiedCards.map(card => card.startTime));
    const timeSpent = Date.now() - startTime;
    
    // End the session
    endStudySession(sessionId, studiedCards.length, correctCards.length);
    
    // Show summary
    setSummaryStats({
      totalCards: studiedCards.length,
      correct: correctCards.length,
      timeSpent,
    });
    setShowSummary(true);
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  // If no cards to study
  if (cards.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">No cards to review!</h2>
        <p className="text-gray-600 mb-6">
          You're all caught up with your reviews for this deck.
        </p>
        <button
          onClick={() => navigate('/decks')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return to Decks
        </button>
      </div>
    );
  }

  // Show summary after completing the session
  if (showSummary) {
    const accuracy = summaryStats.totalCards > 0 
      ? Math.round((summaryStats.correct / summaryStats.totalCards) * 100) 
      : 0;
      
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">Session Complete!</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-600">Cards Reviewed</p>
            <p className="text-3xl font-bold text-blue-700">{summaryStats.totalCards}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-green-600">Accuracy</p>
            <p className="text-3xl font-bold text-green-700">{accuracy}%</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-600">Time Spent</p>
            <p className="text-3xl font-bold text-purple-700">{formatTime(summaryStats.timeSpent)}</p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/decks')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Decks
          </button>
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Study Again
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/decks')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={20} />
          <span>Back to Decks</span>
        </button>
        
        <div className="text-right">
          <span className="text-lg font-medium">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <FlashCard 
        card={currentCard} 
        onRate={handleRate} 
      />
    </div>
  );
};

export default StudySession;