import React, { createContext, useContext } from 'react';

// Simple REST client with credentials and JSON handling
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

async function request(path, { method = 'GET', headers = {}, body, token } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json().catch(() => ({})) : await res.text();
  if (!res.ok) {
    const error = new Error(data?.message || res.statusText);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

const ApiCtx = createContext({ request });

// PUBLIC_INTERFACE
export function ApiProvider({ children }) {
  /** Provides request method for REST API calls. */
  return <ApiCtx.Provider value={{ request }}>{children}</ApiCtx.Provider>;
}

// PUBLIC_INTERFACE
export function useApi() {
  /** Access to API request helper. */
  return useContext(ApiCtx);
}

// PUBLIC_INTERFACE
export const api = {
  /** Auth endpoints */
  auth: {
    login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
    register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
    me: (token) => request('/auth/me', { token }),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },
  profile: {
    get: (token) => request('/profile', { token }),
    update: (payload, token) => request('/profile', { method: 'PUT', body: payload, token }),
    avatarUploadUrl: (token) => request('/profile/avatar-url', { token }),
  },
  rooms: {
    list: (token) => request('/rooms', { token }),
    create: (payload, token) => request('/rooms', { method: 'POST', body: payload, token }),
    join: (roomId, payload, token) => request(`/rooms/${roomId}/join`, { method: 'POST', body: payload, token }),
    leave: (roomId, token) => request(`/rooms/${roomId}/leave`, { method: 'POST', token }),
    get: (roomId, token) => request(`/rooms/${roomId}`, { token }),
  },
  gameplay: {
    history: (token) => request('/matches/history', { token }),
    stats: (userId) => request(`/stats/${userId}`),
    leaderboard: () => request('/leaderboard'),
  },
};
