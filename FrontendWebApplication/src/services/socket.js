import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../state/authStore';

const WS_URL = process.env.REACT_APP_WS_URL || '';

const SocketCtx = createContext(null);

// PUBLIC_INTERFACE
export function SocketProvider({ children }) {
  /**
   * Provides a singleton socket.io client for gameplay, chat, and notifications.
   * Includes auth token in connection headers and auto-reconnects.
   */
  const { token } = useAuthStore();
  const socketRef = useRef(null);

  const socket = useMemo(() => {
    if (!WS_URL) return null;
    const s = io(WS_URL, {
      autoConnect: !!token,
      transports: ['websocket'],
      auth: token ? { token } : undefined,
    });
    socketRef.current = s;
    return s;
  }, [token]);

  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;
    function onConnect() { /* no-op, consumers can subscribe */ }
    function onDisconnect() { /* no-op */ }
    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.close();
    };
  }, [socket]);

  return <SocketCtx.Provider value={socket}>{children}</SocketCtx.Provider>;
}

// PUBLIC_INTERFACE
export function useSocket() {
  /** Access to socket.io client instance. */
  return useContext(SocketCtx);
}
