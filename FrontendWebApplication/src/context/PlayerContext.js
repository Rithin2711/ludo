import { createContext } from 'react';

export const PlayerContext = createContext({
  players: [],
  togglePlayer: () => {}
});
