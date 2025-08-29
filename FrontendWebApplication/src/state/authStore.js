import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Generate a random anonymous user ID
const generateAnonymousId = () => Math.random().toString(36).substring(2, 15);

// PUBLIC_INTERFACE
export const useAuthStore = create(persist((set, get) => ({
  // Default anonymous user
  user: { id: generateAnonymousId(), username: 'Player 1', isAnonymous: true },
  token: 'anonymous-session',
  loading: false,
  error: null,

  // Mock functions that maintain anonymous session
  login: async () => {},
  register: async () => {},
  loadSession: async () => {},
  logout: async () => {}
}), {
  name: 'ludo-auth',
  partialize: (state) => ({ token: state.token, user: state.user }),
}));
