import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFlashcards, getDecks } from '../utils/storage';
import { getDueCards } from '../utils/sm2';
import StudySession from '../components/Study/StudySession';
import { Flashcard, Deck } from '../types';

const StudyPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [deck, setDeck] = useState<Deck | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadCards = () => {
      const allCards = getFlashcards();
      
      if (deckId) {
        // Study specific deck
        const filteredCards = getDueCards(
          allCards.filter((card) => card.deckId === deckId),
          deckId
        );
        setCards(filteredCards);
        
        // Load deck info
        const decks = getDecks();
        const currentDeck = decks.find((d) => d.id === deckId);
        setDeck(currentDeck || null);
      } else {
        // Study all due cards across all decks
        const dueCards = getDueCards(allCards);
        setCards(dueCards);
      }
      
      setLoading(false);
    };
    
    loadCards();
  }, [deckId]);
  
  const handleComplete = () => {
    // Reload cards when study session completes
    setLoading(true);
    const allCards = getFlashcards();
    
    if (deckId) {
      const filteredCards = getDueCards(
        allCards.filter((card) => card.deckId === deckId),
        deckId
      );
      setCards(filteredCards);
    } else {
      const dueCards = getDueCards(allCards);
      setCards(dueCards);
    }
    
    setLoading(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-blue-500">Loading...</div>
      </div>
    );
  }
  
  if (!deckId && cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">All Caught Up!</h2>
        <p className="text-gray-600 mb-6">
          You have no cards due for review. Check back later or add more cards to your decks.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/decks')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            My Decks
          </button>
          <button
            onClick={() => navigate('/add')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Cards
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {deck && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{deck.name}</h1>
          <p className="text-gray-600">{deck.description}</p>
        </div>
      )}
      
      <StudySession
        cards={cards}
        deckId={deckId || 'all'}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default StudyPage;