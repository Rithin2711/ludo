import React from 'react';
import PlayerCorner from './PlayerCorner';

/**
 * Ludo Board visual container.
 * Dynamically renders 2, 3, or 4 corners, each with dice and 4 tokens.
 * Adds visual classic Ludo layout: home bases, cross paths, and center star/goal.
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
        {/* Classic Ludo layout (visual only) */}
        <div className="ludo-grid" aria-hidden>
          {/* Home bases */}
          <div className="home-base home-green" />
          <div className="home-base home-red" />
          <div className="home-base home-blue" />
          <div className="home-base home-yellow" />

          {/* Arms / paths */}
          <div className="path path-vertical" />
          <div className="path path-horizontal" />

          {/* Home lanes (toward center) */}
          <div className="lane lane-green" />
          <div className="lane lane-red" />
          <div className="lane lane-blue" />
          <div className="lane lane-yellow" />

          {/* Center goal */}
          <div className="center-goal">
            <div className="center-triangle green" />
            <div className="center-triangle red" />
            <div className="center-triangle blue" />
            <div className="center-triangle yellow" />
          </div>
        </div>

        <div className="center-mark" aria-hidden>
          LudoMaster
        </div>
        {renderCorners()}
      </div>
    </section>
  );
}
