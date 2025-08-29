import React from 'react';
import PlayerCorner from './PlayerCorner';

/**
 * Ludo Board visual container.
 * Dynamically renders 2, 3, or 4 corners, each with dice and 4 tokens.
 * This is a layout-only board; full movement/path logic can be added later.
 */

// PUBLIC_INTERFACE
export default function Board({
  players,
  coins,
  diceValues,
  currentPlayer,
  onRollDice,
  onMoveCoin
}) {
  const renderCorners = () => {
    return players.map((p, idx) => {
      const diceValue = diceValues[idx] ?? 1;
      const isActive = idx === currentPlayer;
      // merge coin demo state into player
      const playerWithCoins = { ...p, coins: coins[idx]?.coins || p.coins };
      return (
        <PlayerCorner
          key={p.id}
          player={playerWithCoins}
          diceValue={diceValue}
          isActive={isActive}
          onRoll={onRollDice}
          onMoveCoin={onMoveCoin}
        />
      );
    });
  };

  return (
    <section className="board-wrap" aria-label="Ludo board container">
      <div className="board" role="application" aria-roledescription="Ludo board">
        <div className="center-mark" aria-hidden>
          LudoMaster
        </div>
        {renderCorners()}
      </div>
    </section>
  );
}
