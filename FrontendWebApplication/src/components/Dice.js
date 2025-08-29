import React from 'react';

/**
 * Dice showing current value with accessibility and keyboard support.
 */

// PUBLIC_INTERFACE
export default function Dice({ value = 1, onRoll, disabled = false }) {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRoll?.();
    }
  };

  return (
    <button
      className={`dice ${!disabled ? 'rollable' : ''}`}
      onClick={onRoll}
      disabled={disabled}
      aria-label={`Dice showing ${value}. ${disabled ? 'Not your turn.' : 'Press to roll.'}`}
      onKeyDown={handleKeyDown}
    >
      {value}
    </button>
  );
}
