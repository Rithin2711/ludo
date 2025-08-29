import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../services/socket';
import { useAuthStore } from '../state/authStore';

// Construct a minimal 15x15 grid placeholder Ludo board for visualization
function buildBoard() {
  const cells = [];
  for (let r = 0; r < 15; r++) {
    const row = [];
    for (let c = 0; c < 15; c++) {
      row.push({ r, c, cls: 'square' });
    }
    cells.push(row);
  }
  // Mark some safe squares for demo visual
  const safe = [[1,6],[6,1],[8,13],[13,8]];
  safe.forEach(([r,c])=> cells[r][c].cls += ' safe');
  return cells;
}

// PUBLIC_INTERFACE
export default function Game() {
  /**
   * Real-time gameplay and in-game chat. Uses WebSockets:
   * - room:<id>:state for game updates
   * - room:<id>:chat for chat messages
   */
  const { id } = useParams();
  const socket = useSocket();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [dice, setDice] = useState(1);
  const [gameState, setGameState] = useState({ turn: null, pieces: [] });

  const board = useMemo(buildBoard, []);

  useEffect(() => {
    if (!socket) return;
    function onGameUpdate(payload) {
      setGameState(payload);
    }
    function onChat(msg) {
      setMessages((m) => [...m, msg]);
    }
    socket.emit('room:join', { roomId: id });
    socket.on(`room:${id}:state`, onGameUpdate);
    socket.on(`room:${id}:chat`, onChat);
    return () => {
      socket.emit('room:leave', { roomId: id });
      socket.off(`room:${id}:state`, onGameUpdate);
      socket.off(`room:${id}:chat`, onChat);
    };
  }, [socket, id]);

  function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    const msg = { id: Date.now(), user: user?.username || 'Me', text: input.trim(), ts: new Date().toISOString(), me: true };
    setMessages((m) => [...m, { ...msg }]);
    socket.emit('room:chat', { roomId: id, text: input.trim() });
    setInput('');
  }

  function rollDice() {
    if (!socket) return;
    socket.emit('room:roll', { roomId: id });
  }

  useEffect(() => {
    if (!socket) return;
    function onDice(payload) {
      setDice(payload.value);
    }
    socket.on(`room:${id}:dice`, onDice);
    return () => socket.off(`room:${id}:dice`, onDice);
  }, [socket, id]);

  return (
    <div className="grid cols-2">
      <section className="card" aria-label="Ludo board and controls">
        <div className="spread">
          <div className="card-title">Game</div>
          <div className="row">
            <div className="dice" aria-live="polite" aria-label={`Dice value ${dice}`}>{dice}</div>
            <button className="btn" onClick={rollDice} aria-label="Roll dice">Roll</button>
          </div>
        </div>
        <div style={{ margin: '12px 0' }} className="muted small">Turn: {gameState.turn || 'Waiting...'}</div>
        <div className="board" role="grid" aria-label="Ludo board grid">
          {board.map((row, ri) => row.map((cell, ci) => (
            <div key={`${ri}-${ci}`} role="gridcell" aria-label={`Row ${ri+1} Column ${ci+1}`} className={cell.cls}>
              {/* Render sample pieces if match positions */}
            </div>
          )))}
        </div>
      </section>
      <section className="card chat" aria-label="In-game chat">
        <div className="card-title">Chat</div>
        <div className="chat-messages" role="log" aria-live="polite">
          {messages.map((m) => (
            <div key={m.id} className={`message ${m.me ? 'me':''}`}>
              <div className="small muted">{m.user}</div>
              <div>{m.text}</div>
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={sendMessage}>
          <input className="input" placeholder="Type message" value={input} onChange={(e)=>setInput(e.target.value)} aria-label="Chat message" />
          <button className="btn" type="submit">Send</button>
        </form>
      </section>
    </div>
  );
}
