import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import DeckCard from '../components/Deck/DeckCard';
import DeckForm from '../components/Deck/DeckForm';
import { Deck } from '../types';
import { getDecks, saveDeck, updateDeck, deleteDeck } from '../utils/storage';

const DecksPage: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = () => {
    const loadedDecks = getDecks();
    setDecks(loadedDecks);
  };

  const handleCreateDeck = () => {
    setEditingDeck(null);
    setIsCreating(true);
  };

  const handleEditDeck = (deck: Deck) => {
    setIsCreating(false);
    setEditingDeck(deck);
  };

  const handleDeleteDeck = (deckId: string) => {
    if (confirm('Are you sure you want to delete this deck? All cards in this deck will be deleted as well.')) {
      deleteDeck(deckId);
      loadDecks();
    }
  };

  const handleSaveDeck = (deckData: Omit<Deck, 'id' | 'createdAt' | 'lastStudied' | 'cardCount'>) => {
    if (editingDeck) {
      const updatedDeck = {
        ...editingDeck,
        ...deckData,
      };
      updateDeck(updatedDeck);
    } else {
      saveDeck(deckData);
    }
    
    setIsCreating(false);
    setEditingDeck(null);
    loadDecks();
  };

  const handleCancelEdit = () => {
    setIsCreating(false);
    setEditingDeck(null);
  };

  const handleStudyDeck = (deckId: string) => {
    navigate(`/study/${deckId}`);
  };

  const filteredDecks = decks.filter(deck => 
    deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deck.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isCreating || editingDeck) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <DeckForm
          initialDeck={editingDeck || undefined}
          onSave={handleSaveDeck}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Your Decks</h1>
          <p className="text-gray-600">Manage and study your flashcard decks</p>
        </div>
        
        <button
          onClick={handleCreateDeck}
          className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          <Plus size={18} className="mr-1" />
          New Deck
        </button>
      </div>
      
      {decks.length > 0 ? (
        <>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search decks..."
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onEdit={() => handleEditDeck(deck)}
                onDelete={() => handleDeleteDeck(deck.id)}
                onStudy={() => handleStudyDeck(deck.id)}
              />
            ))}
          </div>
          
          {filteredDecks.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No decks found matching your search.</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-800 mb-2">No decks yet</h3>
          <p className="text-gray-600 mb-4">Create your first deck to get started!</p>
          <button
            onClick={handleCreateDeck}
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <Plus size={18} className="mr-1" />
            Create Deck
          </button>
        </div>
      )}
    </div>
  );
};

export default DecksPage;