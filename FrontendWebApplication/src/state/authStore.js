import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';

// PUBLIC_INTERFACE
export const useAuthStore = create(persist((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  // PUBLIC_INTERFACE
  async login({ identifier, password }) {
    /** Login with email or mobile (identifier) and password */
    set({ loading: true, error: null });
    try {
      const data = await api.auth.login({ identifier, password });
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  // PUBLIC_INTERFACE
  async register({ email, mobile, username, password }) {
    /** Register new user */
    set({ loading: true, error: null });
    try {
      const data = await api.auth.register({ email, mobile, username, password });
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (e) {
      set({ error: e.message, loading: false });
      throw e;
    }
  },

  // PUBLIC_INTERFACE
  async loadSession() {
    /** Load current session from backend if token exists */
    const token = get().token;
    if (!token) return;
    set({ loading: true, error: null });
    try {
      const data = await api.auth.me(token);
      set({ user: data.user, loading: false });
    } catch (e) {
      set({ error: null, token: null, user: null, loading: false });
    }
  },

  // PUBLIC_INTERFACE
  async logout() {
    /** Logout user */
    try { await api.auth.logout(); } catch (e) { /* ignore */ }
    set({ user: null, token: null, error: null });
  }
}), {
  name: 'ludo-auth',
  partialize: (state) => ({ token: state.token, user: state.user }),
}));
