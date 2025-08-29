import React from 'react';

/**
 * Token - a player's coin. Color-coded with keyboard support.
 * position is a simple string: 'yard' | 'start' | 'mid' (demo only)
 */

// PUBLIC_INTERFACE
export default function Token({ color, label, onActivate }) {
  const ariaLabel = `${label} token, ${color} player. Press Enter to move (demo).`;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`token ${color}`}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      onClick={onActivate}
    >
      <span className="badge">{label}</span>
    </div>
  );
}
