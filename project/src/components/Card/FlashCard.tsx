import React, { useState, useRef } from 'react';
import { Flashcard as FlashcardType, ConfidenceRating } from '../../types';
import { getCardStatus } from '../../utils/sm2';

interface FlashcardProps {
  card: FlashcardType;
  onRate?: (rating: ConfidenceRating) => void;
  editable?: boolean;
}

const FlashCard: React.FC<FlashcardProps> = ({ card, onRate, editable = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    if (!editable) {
      setIsFlipping(true);
      setIsFlipped(!isFlipped);
      setTimeout(() => setIsFlipping(false), 300);
    }
  };

  const handleRate = (rating: ConfidenceRating) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRate) {
      onRate(rating);
    }
  };

  const cardStatus = getCardStatus(card);
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    learning: 'bg-yellow-100 text-yellow-800',
    review: 'bg-purple-100 text-purple-800',
    mastered: 'bg-green-100 text-green-800'
  };

  return (
    <div 
      className="w-full max-w-xl mx-auto perspective-1000"
      style={{ perspective: '1000px' }}
      onClick={handleFlip}
    >
      <div
        ref={cardRef}
        className={`relative w-full h-64 cursor-pointer transition-transform duration-300 transform-style-preserve-3d shadow-lg rounded-xl ${
          isFlipping ? 'pointer-events-none' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
        }}
      >
        {/* Card Front */}
        <div
          className="absolute w-full h-full bg-white p-6 rounded-xl backface-hidden flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[cardStatus]}`}>
              {cardStatus}
            </span>
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end">
                {card.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex-grow flex items-center justify-center text-center p-4">
            <h3 className="text-xl font-medium text-gray-800">{card.front}</h3>
          </div>
          
          {!editable && (
            <div className="text-sm text-center text-gray-500 mt-auto">
              Click to reveal answer
            </div>
          )}
        </div>

        {/* Card Back */}
        <div
          className="absolute w-full h-full bg-white p-6 rounded-xl backface-hidden flex flex-col"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="flex-grow flex items-center justify-center text-center p-4">
            <div className="text-xl font-medium text-gray-800">{card.back}</div>
          </div>

          {onRate && (
            <div className="flex justify-center gap-2 mt-auto">
              <button
                onClick={handleRate(0)}
                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
              >
                Again
              </button>
              <button
                onClick={handleRate(1)}
                className="px-3 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 transition"
              >
                Hard
              </button>
              <button
                onClick={handleRate(3)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
              >
                Good
              </button>
              <button
                onClick={handleRate(5)}
                className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition"
              >
                Easy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashCard;