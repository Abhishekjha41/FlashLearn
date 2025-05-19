import React from 'react';
import { Pencil, Trash2, BookOpen } from 'lucide-react';
import { Deck } from '../../types';
import { getFlashcards } from '../../utils/storage';
import { getReviewStats } from '../../utils/sm2';

interface DeckCardProps {
  deck: Deck;
  onEdit: () => void;
  onDelete: () => void;
  onStudy: () => void;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck, onEdit, onDelete, onStudy }) => {
  // Get cards for this deck to calculate stats
  const allCards = getFlashcards();
  const deckCards = allCards.filter(card => card.deckId === deck.id);
  const stats = getReviewStats(deckCards);
  
  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{deck.name}</h3>
            <p className="text-gray-600 mt-1">{deck.description}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-500 hover:text-blue-500 transition"
              title="Edit deck"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-500 hover:text-red-500 transition"
              title="Delete deck"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-500">Cards</div>
            <div className="font-semibold text-lg">{deck.cardCount}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-500">Last Studied</div>
            <div className="font-semibold">{formatDate(deck.lastStudied)}</div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-blue-50 p-2 rounded text-center">
            <div className="text-blue-700 font-medium">{stats.dueToday}</div>
            <div className="text-xs text-blue-600">Due Today</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded text-center">
            <div className="text-yellow-700 font-medium">{stats.new}</div>
            <div className="text-xs text-yellow-600">New</div>
          </div>
          <div className="bg-green-50 p-2 rounded text-center">
            <div className="text-green-700 font-medium">{stats.learned}</div>
            <div className="text-xs text-green-600">Learned</div>
          </div>
        </div>
        
        <button
          onClick={onStudy}
          className="w-full mt-5 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <BookOpen size={18} />
          Study Now
        </button>
      </div>
    </div>
  );
};

export default DeckCard;