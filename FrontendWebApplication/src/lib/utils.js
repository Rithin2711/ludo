export const getThemeFromPrefers = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return 'dark';
};

export const playerColors = ['green', 'red', 'blue', 'yellow'];

export const defaultPlayers = [
  { id: 0, name: 'Player 1', color: 'green', corner: 'tl', coins: new Array(4).fill(null) },
  { id: 1, name: 'Player 2', color: 'red', corner: 'tr', coins: new Array(4).fill(null) },
  { id: 2, name: 'Player 3', color: 'blue', corner: 'bl', coins: new Array(4).fill(null) },
  { id: 3, name: 'Player 4', color: 'yellow', corner: 'br', coins: new Array(4).fill(null) },
];

/**
 * PUBLIC_INTERFACE
 * Compute next player's index given current index and total players
 */
export const nextPlayerIndex = (idx, total) => (idx + 1) % total;
