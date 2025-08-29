import React from 'react';

/**
 * Footer with small print
 */

// PUBLIC_INTERFACE
export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} LudoMaster</span>
        <span>Accessibility: Keyboard and screen reader friendly UI</span>
      </div>
    </footer>
  );
}
