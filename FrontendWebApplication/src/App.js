import React, { useState } from 'react';
import './App.css';
import LudoBoard from './components/LudoBoard';
import { PlayerContext } from './context/PlayerContext';

// PUBLIC_INTERFACE
function App() {
  /** Main app shell showing Ludo board directly */
  const [players, setPlayers] = useState([
    { id: 1, color: 'r', name: 'Player 1', active: true },
    { id: 2, color: 'g', name: 'Player 2', active: false },
    { id: 3, color: 'b', name: 'Player 3', active: false },
    { id: 4, color: 'y', name: 'Player 4', active: false }
  ]);

  const togglePlayer = (id) => {
    setPlayers(players.map(p => ({
      ...p,
      active: p.id === id ? !p.active : p.active
    })));
  };

  return (
    <PlayerContext.Provider value={{ players, togglePlayer }}>
      <div className="app">
        <nav className="navbar">
          <div className="brand">
            <span className="logo" aria-hidden="true"></span>
            <span className="bold">LudoMaster</span>
          </div>
        </nav>
        <main className="container">
          <LudoBoard />
        </main>
      </div>
    </PlayerContext.Provider>
  );
}

export default App;
