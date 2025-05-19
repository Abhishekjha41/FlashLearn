import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Filter, Search, Edit, Trash2 } from 'lucide-react';
import CardForm from '../components/Card/CardForm';
import FlashCard from '../components/Card/FlashCard';
import { Flashcard, Deck } from '../types';
import { getFlashcards, getDecks, saveFlashcard, updateFlashcard, deleteFlashcard } from '../utils/storage';

const CardManagementPage: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [selectedDeckId, setSelectedDeckId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCards();
  }, [cards, selectedDeckId, searchTerm, selectedTags]);

  const loadData = () => {
    const loadedCards = getFlashcards();
    const loadedDecks = getDecks();
    
    setCards(loadedCards);
    setDecks(loadedDecks);
    
    // Extract all unique tags
    const tags = new Set<string>();
    loadedCards.forEach((card) => {
      card.tags.forEach((tag) => tags.add(tag));
    });
    setAvailableTags(Array.from(tags).sort());
  };

  const filterCards = () => {
    let result = [...cards];
    
    // Filter by deck
    if (selectedDeckId !== 'all') {
      result = result.filter((card) => card.deckId === selectedDeckId);
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (card) =>
          card.front.toLowerCase().includes(term) ||
          card.back.toLowerCase().includes(term)
      );
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter((card) =>
        selectedTags.some((tag) => card.tags.includes(tag))
      );
    }
    
    setFilteredCards(result);
  };

  const handleCreateCard = () => {
    setEditingCard(null);
    setIsCreating(true);
  };

  const handleEditCard = (card: Flashcard) => {
    setEditingCard(card);
    setIsCreating(true);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      deleteFlashcard(cardId);
      loadData();
    }
  };

  const handleSaveCard = (
    cardData: Omit<Flashcard, 'id' | 'createdAt' | 'lastReviewed' | 'nextReview' | 'easeFactor' | 'interval' | 'repetitions'>
  ) => {
    if (editingCard) {
      const updatedCard = {
        ...editingCard,
        ...cardData,
      };
      updateFlashcard(updatedCard);
    } else {
      saveFlashcard(cardData);
    }
    
    setIsCreating(false);
    setEditingCard(null);
    loadData();
  };

  const handleCancelEdit = () => {
    setIsCreating(false);
    setEditingCard(null);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  if (isCreating || editingCard) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <button
          onClick={handleCancelEdit}
          className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Cards
        </button>
        
        <CardForm
          initialCard={editingCard || undefined}
          onSave={handleSaveCard}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Flashcards</h1>
          <p className="text-gray-600">Manage your flashcards</p>
        </div>
        
        <button
          onClick={handleCreateCard}
          className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          <Plus size={18} className="mr-1" />
          New Card
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search cards..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <select
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value)}
            >
              <option value="all">All Decks</option>
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <button
              className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md flex items-center"
            >
              <Filter size={18} className="mr-1 text-gray-500" />
              <span>Tags</span>
            </button>
            
            {availableTags.length > 0 && (
              <div className="absolute z-10 mt-2 w-64 bg-white rounded-md shadow-lg p-2 right-0">
                <div className="max-h-60 overflow-y-auto">
                  {availableTags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      <input
                        type="checkbox"
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`tag-${tag}`}
                        className="flex-grow cursor-pointer"
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className="ml-1.5 text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {filteredCards.length > 0 ? (
        <div className="space-y-6">
          {filteredCards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  {decks.find(d => d.id === card.deckId)?.name && (
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                      {decks.find(d => d.id === card.deckId)?.name}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCard(card)}
                    className="p-2 text-gray-500 hover:text-blue-500 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-2 text-gray-500 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <FlashCard card={card} editable={true} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-800 mb-2">No cards found</h3>
          <p className="text-gray-600 mb-4">
            {cards.length === 0
              ? "You haven't created any flashcards yet."
              : "No cards match your filters."}
          </p>
          {cards.length === 0 && (
            <button
              onClick={handleCreateCard}
              className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              <Plus size={18} className="mr-1" />
              Create Card
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CardManagementPage;