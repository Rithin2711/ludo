import { defaultPlayers } from './utils';
import { createInitialCoin } from './path';

/**
 * Create initial coin state using path model:
 * Each coin starts in { status: 'yard' } and progresses via path.js helpers.
 */

// PUBLIC_INTERFACE
export const initialCoinsState = (players = defaultPlayers) => {
  return players.map((p) => ({
    playerId: p.id,
    color: p.color,
    coins: Array.from({ length: 4 }, () => createInitialCoin()),
  }));
};
