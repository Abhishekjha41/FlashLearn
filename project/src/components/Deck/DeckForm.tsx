import React, { useState } from 'react';
import { Deck } from '../../types';

interface DeckFormProps {
  initialDeck?: Partial<Deck>;
  onSave: (deck: Omit<Deck, 'id' | 'createdAt' | 'lastStudied' | 'cardCount'>) => void;
  onCancel: () => void;
}

const DeckForm: React.FC<DeckFormProps> = ({ initialDeck, onSave, onCancel }) => {
  const [name, setName] = useState(initialDeck?.name || '');
  const [description, setDescription] = useState(initialDeck?.description || '');
  const [errors, setErrors] = useState({ name: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (name.trim() === '') {
      setErrors({ name: 'Deck name cannot be empty' });
      return;
    }
    
    onSave({
      name: name.trim(),
      description: description.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {initialDeck ? 'Edit Deck' : 'Create New Deck'}
      </h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Deck Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim() !== '') {
              setErrors({ ...errors, name: '' });
            }
          }}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter deck name"
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
          placeholder="Enter deck description"
        />
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
          Save Deck
        </button>
      </div>
    </form>
  );
};

export default DeckForm;