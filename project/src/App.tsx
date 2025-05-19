import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import HomePage from './pages/HomePage';
import DecksPage from './pages/DecksPage';
import StudyPage from './pages/StudyPage';
import StatsPage from './pages/StatsPage';
import CardManagementPage from './pages/CardManagementPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow pb-16 sm:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/decks" element={<DecksPage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/study/:deckId" element={<StudyPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/add" element={<CardManagementPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;