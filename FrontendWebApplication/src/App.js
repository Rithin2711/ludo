import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';
import { useAuthStore } from './state/authStore';

// PUBLIC_INTERFACE
function App() {
  /** App Shell with direct game access */
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="container" role="main">
          <Routes>
            <Route path="/" element={<Navigate to="/game/auto" replace />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <div id="live-announcer" aria-live="polite" className="visually-hidden" />
      </div>
    </BrowserRouter>
  );
}

function Navbar() {
  const { user } = useAuthStore();
  return (
    <nav className="navbar" aria-label="Primary">
      <div className="brand">
        <span className="logo" aria-hidden="true"></span>
        <span className="bold">LudoMaster</span>
      </div>
      <div className="nav-actions" role="navigation" aria-label="User">
        <span className="btn secondary">Playing as: {user.username}</span>
      </div>
    </nav>
  );
}

export default App;
