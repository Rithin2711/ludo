import React from 'react';

/**
 * Game controls: pick player count and roll for current player
 */

// PUBLIC_INTERFACE
export default function ControlsBar({
  playerCount,
  setPlayerCount,
  players,
  currentPlayer,
  onRoll,
  currentDiceValue
}) {
  return (
    <section className="controls" aria-label="Game controls">
      <label htmlFor="player-count" className="pill" aria-live="polite">
        Players:
      </label>
      <select
        id="player-count"
        className="select"
        aria-label="Select number of players"
        value={playerCount}
        onChange={(e) => setPlayerCount(parseInt(e.target.value, 10))}
      >
        <option value={2}>2 Players</option>
        <option value={3}>3 Players</option>
        <option value={4}>4 Players</option>
      </select>

      <span className="pill" aria-live="polite">
        Turn: {players[currentPlayer]?.name}
      </span>

      <button className="btn" onClick={onRoll} aria-label="Roll dice for current player">
        Roll Dice · {currentDiceValue}
      </button>
    </section>
  );
}
