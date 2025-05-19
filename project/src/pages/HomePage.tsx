import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, BarChart2 } from 'lucide-react';
import { getDecks, getFlashcards, getUserStats } from '../utils/storage';
import { getDueCards, getReviewStats } from '../utils/sm2';
import { Deck, Flashcard, UserStats } from '../types';

const HomePage: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = () => {
      const loadedDecks = getDecks();
      const allCards = getFlashcards();
      const due = getDueCards(allCards);
      const userStats = getUserStats();
      
      setDecks(loadedDecks);
      setDueCards(due);
      setStats(userStats);
      setLoading(false);
    };
    
    loadData();
  }, []);
  
  const getTodaysReviewCount = () => {
    const allCards = getFlashcards();
    const reviewStats = getReviewStats(allCards);
    return reviewStats.dueToday;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-blue-500">Loading...</div>
      </div>
    );
  }
  
  // First-time user experience
  if (decks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="mb-8">
          <Brain className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to FlashLearn!</h1>
          <p className="text-gray-600">
            Your personal spaced repetition flashcard system for efficient learning.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <ol className="text-left space-y-4">
            <li className="flex">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
              <span>Create your first deck of flashcards</span>
            </li>
            <li className="flex">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
              <span>Add cards with questions on the front and answers on the back</span>
            </li>
            <li className="flex">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
              <span>Study and rate your confidence to optimize your learning</span>
            </li>
          </ol>
        </div>
        
        <button
          onClick={() => navigate('/decks')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Create Your First Deck
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Greeting & Streak */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            {stats?.lastStudyDate 
              ? `Last study session: ${new Date(stats.lastStudyDate).toLocaleDateString()}`
              : 'Start your learning journey today!'}
          </p>
        </div>
        
        {stats && stats.streakDays > 0 && (
          <div className="mt-4 md:mt-0 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-lg flex items-center">
            <Clock className="mr-2" size={20} />
            <span className="font-medium">{stats.streakDays} day streak!</span>
          </div>
        )}
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-gray-500 text-sm mb-1">Due Today</h3>
          <p className="text-2xl font-bold">{getTodaysReviewCount()}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-gray-500 text-sm mb-1">Total Cards</h3>
          <p className="text-2xl font-bold">{getFlashcards().length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-gray-500 text-sm mb-1">Total Decks</h3>
          <p className="text-2xl font-bold">{decks.length}</p>
        </div>
      </div>
      
      {/* Review Now Section */}
      {dueCards.length > 0 ? (
        <div className="bg-blue-50 border border-blue-100 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-blue-800">Time to review!</h2>
              <p className="text-blue-600">
                You have {dueCards.length} cards due for review today.
              </p>
            </div>
            <button
              onClick={() => navigate('/study')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Study Now
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-100 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-800">All caught up!</h2>
          <p className="text-green-600">You've completed all your reviews for today.</p>
        </div>
      )}
      
      {/* Recent Decks */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Your Decks</h2>
          <button
            onClick={() => navigate('/decks')}
            className="text-blue-500 hover:text-blue-700"
          >
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decks.slice(0, 4).map(deck => (
            <div 
              key={deck.id} 
              className="bg-white rounded-lg shadow p-5 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/study/${deck.id}`)}
            >
              <h3 className="font-medium text-gray-800 mb-2">{deck.name}</h3>
              <div className="text-gray-500 text-sm">{deck.cardCount} cards</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Stats Link */}
      <div 
        className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow flex items-center"
        onClick={() => navigate('/stats')}
      >
        <div className="p-3 bg-indigo-100 rounded-full mr-4">
          <BarChart2 className="text-indigo-600" size={24} />
        </div>
        <div>
          <h3 className="font-medium text-gray-800">View Detailed Stats</h3>
          <p className="text-gray-500 text-sm">
            Track your learning progress and review history
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;