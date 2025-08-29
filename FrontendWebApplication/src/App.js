import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Board from './components/Board';
import ControlsBar from './components/ControlsBar';
import Header from './components/Header';
import Footer from './components/Footer';
import { defaultPlayers, getThemeFromPrefers, nextPlayerIndex } from './lib/utils';
import { initialCoinsState } from './lib/state';

/**
 * LudoMaster – main application entry with local demo state.
 * Provides:
 * - Theme toggle
 * - Player count selection (2–4)
 * - Minimal demo logic: turn rotation and dice roll
 * - Renders Board with coins and dice at corners
 */

// PUBLIC_INTERFACE
function App() {
  /** Theme management with prefers-color-scheme fallback */
  const [theme, setTheme] = useState(getThemeFromPrefers());
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  /** Game demo state (no backend) */
  const [playerCount, setPlayerCount] = useState(4);
  const players = useMemo(() => defaultPlayers.slice(0, playerCount), [playerCount]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValues, setDiceValues] = useState(() =>
    players.map(() => 1)
  );
  const [coins, setCoins] = useState(() => initialCoinsState(players));

  useEffect(() => {
    // Reset state when player count changes
    setCurrentPlayer(0);
    setDiceValues(players.map(() => 1));
    setCoins(initialCoinsState(players));
  }, [players.length]);

  const rollDice = (playerIdx) => {
    const value = Math.floor(Math.random() * 6) + 1;
    setDiceValues((prev) => {
      const next = [...prev];
      next[playerIdx] = value;
      return next;
    });
    // Minimal movement demo: toggle first coin between yard and start path cell
    setCoins((prev) => {
      const next = structuredClone(prev);
      const pl = next[playerIdx];
      if (!pl) return prev;
      const coin = pl.coins[0];
      if (!coin) return prev;
      // Toggle demo positions
      coin.position = coin.position === 'yard' ? 'start' : 'yard';
      return next;
    });
    // advance turn
    setCurrentPlayer((idx) => nextPlayerIndex(idx, players.length));
  };

  const onMoveCoin = (playerIdx, coinIdx) => {
    // Demo: cycle coin position through yard -> start -> mid -> yard
    setCoins((prev) => {
      const next = structuredClone(prev);
      const coin = next[playerIdx]?.coins?.[coinIdx];
      if (!coin) return prev;
      const order = ['yard', 'start', 'mid'];
      const i = order.indexOf(coin.position);
      coin.position = order[(i + 1) % order.length];
      return next;
    });
  };

  return (
    <div className="App ludo-app">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="main">
        <ControlsBar
          playerCount={playerCount}
          setPlayerCount={setPlayerCount}
          players={players}
          currentPlayer={currentPlayer}
          onRoll={() => rollDice(currentPlayer)}
          currentDiceValue={diceValues[currentPlayer] ?? 1}
        />
        <Board
          players={players}
          coins={coins}
          diceValues={diceValues}
          currentPlayer={currentPlayer}
          onRollDice={rollDice}
          onMoveCoin={onMoveCoin}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
