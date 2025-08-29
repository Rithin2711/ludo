import { defaultPlayers } from './utils';

/**
 * Create initial demo coin state:
 * Each player has four coins with a simple 'position' field
 * ('yard' | 'start' | 'mid'), used just for demo toggles.
 */

// PUBLIC_INTERFACE
export const initialCoinsState = (players = defaultPlayers) => {
  return players.map((p) => ({
    playerId: p.id,
    coins: Array.from({ length: 4 }, () => ({ position: 'yard' })),
  }));
};
