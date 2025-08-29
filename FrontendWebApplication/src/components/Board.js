import React from 'react';
import PlayerCorner from './PlayerCorner';
import { getCoinCSSPosition } from '../lib/path';

/**
 * Ludo Board visual container.
 * Dynamically renders 2, 3, or 4 corners, each with dice and 4 tokens.
 * Adds visual classic Ludo layout: home bases, cross paths, and center star/goal.
 * Now renders moving tokens on the visible track according to their path state.
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
      // map coin state to player
      const playerCoins = coins[idx]?.coins || p.coins;
      const playerWithCoins = { ...p, coins: playerCoins };
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

  const renderTrackTokens = () => {
    // Render coins that are on main track, home lane, or finished (at center).
    const items = [];
    coins.forEach((pState, pIdx) => {
      const color = players[pIdx]?.color || pState.color;
      pState.coins.forEach((coinPos, cIdx) => {
        const coords = getCoinCSSPosition(color, coinPos);
        if (!coords) return; // yard: skip rendering on board
        items.push(
          <div
            key={`t-${pIdx}-${cIdx}`}
            className={`token ${color}`}
            style={{
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              top: coords.top,
              left: coords.left,
              width: '5.8%',
              zIndex: 2,
            }}
            role="button"
            aria-label={`${players[pIdx]?.name || 'Player'} token ${cIdx + 1}`}
            onClick={() => onMoveCoin(pIdx, cIdx)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onMoveCoin(pIdx, cIdx);
              }
            }}
          >
            <span className="badge">{cIdx + 1}</span>
          </div>
        );
      });
    });
    return items;
  };

  return (
    <section className="board-wrap" aria-label="Ludo board container">
      <div className="board" role="application" aria-roledescription="Ludo board">
        {/* Classic Ludo layout */}
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

        {/* Tokens placed along path according to state */}
        {renderTrackTokens()}

        <div className="center-mark" aria-hidden>
          LudoMaster
        </div>
        {renderCorners()}
      </div>
    </section>
  );
}
