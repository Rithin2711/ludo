import React from 'react';
import Dice from './Dice';
import Token from './Token';

/**
 * Corner area for each player containing name, tokens, and a clearly visible dice space.
 * Shows tokens that are still in 'yard' here. Tokens on the board are rendered by Board.
 */

// PUBLIC_INTERFACE
export default function PlayerCorner({
  player,
  diceValue,
  isActive,
  onRoll,
  onMoveCoin
}) {
  const { name, color, id, coins } = player;

  return (
    <section
      className={`corner ${player.corner}`}
      aria-label={`${name} corner area`}
      style={{ border: `2px solid var(--border)` }}
    >
      <div className="corner-title" aria-live="polite">
        <span aria-hidden>🎮</span>
        <span>{name}</span>
        {isActive && <span className="pill" title="Current turn">Your turn</span>}
      </div>

      <div className="coins" role="group" aria-label={`${name} tokens`}>
        {coins.map((coin, idx) => {
          const inYard = !coin || coin.status === 'yard';
          if (!inYard) {
            // Token is on board; not shown here (reserve slot for consistent layout)
            return (
              <div
                key={`${id}-coin-${idx}`}
                className="token"
                style={{ visibility: 'hidden' }}
                aria-hidden
              />
            );
          }
          return (
            <Token
              key={`${id}-coin-${idx}`}
              color={color}
              label={String(idx + 1)}
              onActivate={() => onMoveCoin(id, idx)}
            />
          );
        })}
      </div>

      <div className="actions">
        <div
          className={`dice-slot dice-slot-${color}`}
          aria-label={`${name} dice area`}
          role="group"
        >
          {/* Dice is allowed to roll only if it's this player's turn.
              App will further prevent rolling if a pending move exists. */}
          <Dice value={diceValue} onRoll={() => onRoll(id)} disabled={!isActive} />
        </div>
        <span className="pill" aria-live="polite">
          Dice: {diceValue}
        </span>
      </div>
    </section>
  );
}
