import React from 'react';

/**
 * Header with brand and theme toggle
 * Accessible button and concise branding.
 */

// PUBLIC_INTERFACE
export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <div className="brand" aria-label="LudoMaster">
          <div className="logo" aria-hidden>LM</div>
          <div>
            <div className="title" aria-label="App name">LudoMaster</div>
            <div className="subtitle">Play classic Ludo with a modern touch</div>
          </div>
        </div>
        <button
          className="btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
    </header>
  );
}
