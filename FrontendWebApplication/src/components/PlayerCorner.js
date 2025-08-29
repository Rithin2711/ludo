import React from 'react';
import Dice from './Dice';
import Token from './Token';

/**
 * Corner area for each player containing name, tokens, and a clearly visible dice space.
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
        {coins.map((coin, idx) => (
          <Token
            key={`${id}-coin-${idx}`}
            color={color}
            label={String(idx + 1)}
            onActivate={() => onMoveCoin(id, idx)}
          />
        ))}
      </div>

      <div className="actions">
        <div
          className={`dice-slot dice-slot-${color}`}
          aria-label={`${name} dice area`}
          role="group"
        >
          <Dice value={diceValue} onRoll={() => onRoll(id)} disabled={!isActive} />
        </div>
        <span className="pill" aria-live="polite">
          Dice: {diceValue}
        </span>
      </div>
    </section>
  );
}
