import React, { useState, useEffect } from 'react';
import { Flashcard } from '../../types';
import { getDecks } from '../../utils/storage';

interface CardFormProps {
  initialCard?: Partial<Flashcard>;
  onSave: (card: Omit<Flashcard, 'id' | 'createdAt' | 'lastReviewed' | 'nextReview' | 'easeFactor' | 'interval' | 'repetitions'>) => void;
  onCancel: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ initialCard, onSave, onCancel }) => {
  const [front, setFront] = useState(initialCard?.front || '');
  const [back, setBack] = useState(initialCard?.back || '');
  const [deckId, setDeckId] = useState(initialCard?.deckId || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialCard?.tags || []);
  const [decks, setDecks] = useState<{ id: string; name: string }[]>([]);
  const [errors, setErrors] = useState({ front: '', back: '', deck: '' });

  useEffect(() => {
    const loadedDecks = getDecks();
    setDecks(loadedDecks);
    
    // If no deck is selected and we have decks, select the first one
    if (!deckId && loadedDecks.length > 0) {
      setDeckId(loadedDecks[0].id);
    }
  }, [deckId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      front: front.trim() === '' ? 'Front side cannot be empty' : '',
      back: back.trim() === '' ? 'Back side cannot be empty' : '',
      deck: deckId === '' ? 'Please select a deck' : ''
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }
    
    onSave({
      front: front.trim(),
      back: back.trim(),
      deckId,
      tags,
    });
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {initialCard ? 'Edit Card' : 'Create New Card'}
      </h2>
      
      <div className="mb-4">
        <label htmlFor="deck" className="block text-sm font-medium text-gray-700 mb-1">
          Deck
        </label>
        <select
          id="deck"
          value={deckId}
          onChange={(e) => setDeckId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="" disabled>Select a deck</option>
          {decks.map(deck => (
            <option key={deck.id} value={deck.id}>
              {deck.name}
            </option>
          ))}
        </select>
        {errors.deck && <p className="text-red-500 text-sm mt-1">{errors.deck}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-1">
          Front Side
        </label>
        <textarea
          id="front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
          placeholder="Enter question or prompt"
          required
        />
        {errors.front && <p className="text-red-500 text-sm mt-1">{errors.front}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-1">
          Back Side
        </label>
        <textarea
          id="back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
          placeholder="Enter answer or explanation"
          required
        />
        {errors.back && <p className="text-red-500 text-sm mt-1">{errors.back}</p>}
      </div>
      
      <div className="mb-6">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex">
          <input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add tags (press Enter to add)"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
          >
            Add
          </button>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1.5 text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Card
        </button>
      </div>
    </form>
  );
};

export default CardForm;