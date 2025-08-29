import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Board from './components/Board';
import ControlsBar from './components/ControlsBar';
import Header from './components/Header';
import Footer from './components/Footer';
import { defaultPlayers, getThemeFromPrefers, nextPlayerIndex } from './lib/utils';
import { initialCoinsState } from './lib/state';
import { applyMove } from './lib/path';

/**
 * LudoMaster – main application entry with local demo state.
 * Provides:
 * - Theme toggle
 * - Player count selection (2–4)
 * - Turn-based flow: roll dice, then move one of your coins by the rolled value
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

  /** Game state (frontend demo only) */
  const [playerCount, setPlayerCount] = useState(4);
  const players = useMemo(() => defaultPlayers.slice(0, playerCount), [playerCount]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValues, setDiceValues] = useState(() =>
    players.map(() => 1)
  );
  const [coins, setCoins] = useState(() => initialCoinsState(players));

  /**
   * pendingMove tracks the requirement that the active player must move one coin
   * after rolling. When null, it means no pending move (either before roll or after move).
   * { playerIdx: number, value: number }
   */
  const [pendingMove, setPendingMove] = useState(null);

  useEffect(() => {
    // Reset state when player count changes
    setCurrentPlayer(0);
    setDiceValues(players.map(() => 1));
    setCoins(initialCoinsState(players));
    setPendingMove(null);
  }, [players.length]);

  const rollDice = (playerIdx) => {
    // Disallow rolling if it is not this player's turn or a move is pending
    if (playerIdx !== currentPlayer || pendingMove) return;

    const value = Math.floor(Math.random() * 6) + 1;
    setDiceValues((prev) => {
      const next = [...prev];
      next[playerIdx] = value;
      return next;
    });

    // After roll, require this player to choose a coin to move by "value"
    setPendingMove({ playerIdx, value });
  };

  const advanceTurn = () => {
    setCurrentPlayer((idx) => nextPlayerIndex(idx, players.length));
  };

  // Move coin using full path rules
  const moveCoinBy = (playerIdx, coinIdx, steps) => {
    setCoins((prev) => {
      const next = structuredClone(prev);
      const playerState = next[playerIdx];
      if (!playerState) return prev;

      const color = playerState.color || players[playerIdx]?.color;
      if (!color) return prev;

      const coin = playerState.coins?.[coinIdx];
      if (coin == null) return prev;

      const updated = applyMove(color, coin, steps);
      playerState.coins[coinIdx] = updated;
      return next;
    });
  };

  const onMoveCoin = (playerIdx, coinIdx) => {
    // Only allow move if:
    // - It is this player's turn
    // - There is a pendingMove for this player (we already rolled)
    if (playerIdx !== currentPlayer) return;
    if (!pendingMove || pendingMove.playerIdx !== playerIdx) return;

    // Execute move by the pending dice value
    moveCoinBy(playerIdx, coinIdx, pendingMove.value);

    // Clear pending move and advance turn
    setPendingMove(null);
    advanceTurn();
  };

  const currentDice = pendingMove?.playerIdx === currentPlayer
    ? pendingMove.value
    : diceValues[currentPlayer] ?? 1;

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
          currentDiceValue={currentDice}
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
