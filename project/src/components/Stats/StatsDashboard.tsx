import React, { useMemo } from 'react';
import { Calendar, Activity, Award } from 'lucide-react';
import { getUserStats, getReviewHistory, getFlashcards } from '../../utils/storage';

const StatsDashboard: React.FC = () => {
  const stats = getUserStats();
  const history = getReviewHistory();
  const cards = getFlashcards();
  
  const chartData = useMemo(() => {
    // Get last 14 days
    const dates: { [date: string]: number } = {};
    const now = new Date();
    
    // Initialize empty data for last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates[dateString] = 0;
    }
    
    // Fill in actual review counts
    history.forEach(review => {
      const date = new Date(review.date);
      const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (dates[dateString] !== undefined) {
        dates[dateString] += 1;
      }
    });
    
    return Object.entries(dates);
  }, [history]);
  
  const getCardStatusCount = () => {
    let newCount = 0;
    let learningCount = 0;
    let reviewCount = 0;
    let masteredCount = 0;
    
    cards.forEach(card => {
      if (!card.lastReviewed) {
        newCount++;
      } else if (card.repetitions < 2) {
        learningCount++;
      } else if (card.interval < 30) {
        reviewCount++;
      } else {
        masteredCount++;
      }
    });
    
    return { newCount, learningCount, reviewCount, masteredCount };
  };
  
  const cardStatusCount = getCardStatusCount();
  const totalCards = cards.length;

  // Calculate streak class based on streak length
  const getStreakClass = () => {
    if (stats.streakDays >= 30) return 'bg-purple-500';
    if (stats.streakDays >= 14) return 'bg-blue-500';
    if (stats.streakDays >= 7) return 'bg-green-500';
    if (stats.streakDays >= 3) return 'bg-yellow-500';
    return 'bg-gray-500';
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Learning Stats</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className={`p-3 rounded-full mr-4 ${getStreakClass()} text-white`}>
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Current Streak</p>
            <p className="text-2xl font-bold">{stats.streakDays} days</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full mr-4 bg-blue-500 text-white">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Reviews</p>
            <p className="text-2xl font-bold">{stats.totalReviews}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
          <div className="p-3 rounded-full mr-4 bg-green-500 text-white">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Cards Learned</p>
            <p className="text-2xl font-bold">{stats.cardsLearned} / {totalCards}</p>
          </div>
        </div>
      </div>
      
      {/* Review Activity Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Review Activity</h3>
        <div className="h-60">
          {chartData.length > 0 ? (
            <div className="flex items-end h-48 gap-1">
              {chartData.map(([date, count], index) => {
                const maxCount = Math.max(...chartData.map(([_, c]) => c));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                let barColor = 'bg-blue-200';
                
                if (percentage > 75) barColor = 'bg-green-500';
                else if (percentage > 50) barColor = 'bg-blue-500';
                else if (percentage > 25) barColor = 'bg-blue-400';
                else if (percentage > 0) barColor = 'bg-blue-300';
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className={`w-full ${barColor} rounded-t transition-all duration-500 ease-in-out`} 
                      style={{ height: `${Math.max(percentage, 2)}%` }}
                    />
                    <div className="text-xs mt-1 text-gray-500 transform -rotate-45 origin-top-left">
                      {date}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No review data available yet
            </div>
          )}
        </div>
      </div>
      
      {/* Card Status Overview */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Card Status Overview</h3>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {totalCards > 0 ? Math.round((cardStatusCount.masteredCount / totalCards) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            {totalCards > 0 && (
              <>
                <div 
                  style={{ width: `${(cardStatusCount.newCount / totalCards) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                />
                <div 
                  style={{ width: `${(cardStatusCount.learningCount / totalCards) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
                />
                <div 
                  style={{ width: `${(cardStatusCount.reviewCount / totalCards) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                />
                <div 
                  style={{ width: `${(cardStatusCount.masteredCount / totalCards) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                />
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">New</p>
            <p className="text-xl font-bold text-yellow-700">{cardStatusCount.newCount}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-800">Learning</p>
            <p className="text-xl font-bold text-orange-700">{cardStatusCount.learningCount}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">Review</p>
            <p className="text-xl font-bold text-blue-700">{cardStatusCount.reviewCount}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800">Mastered</p>
            <p className="text-xl font-bold text-green-700">{cardStatusCount.masteredCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;