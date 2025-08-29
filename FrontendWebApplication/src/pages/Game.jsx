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
  
  // Add home bases
  cells[1][1].cls += ' home-r';
  cells[1][13].cls += ' home-g';
  cells[13][1].cls += ' home-b';
  cells[13][13].cls += ' home-y';
  return cells;
}

// PUBLIC_INTERFACE
export default function Game() {
  /**
   * Auto-initialized gameplay with bots. Uses WebSockets:
   * - room:<id>:state for game updates
   * - room:<id>:chat for chat messages
   */
  const { id } = useParams();
  const socket = useSocket();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [dice, setDice] = useState(1);
  const [gameState, setGameState] = useState({
    turn: 'Player 1',
    pieces: [],
    players: [
      { id: user.id, username: user.username, color: 'r' },
      { id: 'bot1', username: 'Bot 1', color: 'g', isBot: true },
      { id: 'bot2', username: 'Bot 2', color: 'b', isBot: true },
      { id: 'bot3', username: 'Bot 3', color: 'y', isBot: true }
    ]
  });

  const board = useMemo(buildBoard, []);

  useEffect(() => {
    if (!socket) return;
    
    // Auto-initialize game with bots
    if (id === 'auto') {
      socket.emit('room:create', {
        type: 'bot',
        botCount: 3,
        autoStart: true
      });
    }

    function onGameUpdate(payload) {
      setGameState(payload);
    }
    function onChat(msg) {
      setMessages((m) => [...m, msg]);
    }
    
    socket.on(`room:${id}:state`, onGameUpdate);
    socket.on(`room:${id}:chat`, onChat);
    
    // Add system message about game start
    setMessages([{
      id: Date.now(),
      user: 'System',
      text: 'Game started with 3 bots! Your color is Red.',
      ts: new Date().toISOString()
    }]);

    return () => {
      socket.off(`room:${id}:state`, onGameUpdate);
      socket.off(`room:${id}:chat`, onChat);
    };
  }, [socket, id]);

  function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    const msg = { 
      id: Date.now(), 
      user: user?.username || 'Me', 
      text: input.trim(), 
      ts: new Date().toISOString(), 
      me: true 
    };
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
      // Auto-roll for bots after delay
      if (gameState.turn?.includes('Bot')) {
        setTimeout(() => {
          socket.emit('room:roll', { roomId: id });
        }, 1000);
      }
    }
    socket.on(`room:${id}:dice`, onDice);
    return () => socket.off(`room:${id}:dice`, onDice);
  }, [socket, id, gameState.turn]);

  return (
    <div className="grid cols-2">
      <section className="card" aria-label="Ludo board and controls">
        <div className="spread">
          <div className="card-title">Game</div>
          <div className="row">
            <div className="dice" aria-live="polite" aria-label={`Dice value ${dice}`}>{dice}</div>
            <button className="btn" onClick={rollDice} disabled={gameState.turn?.includes('Bot')} aria-label="Roll dice">Roll</button>
          </div>
        </div>
        <div style={{ margin: '12px 0' }} className="muted small">
          Turn: {gameState.turn || 'Waiting...'}
          {gameState.turn?.includes('Bot') && ' (Bot is thinking...)'}
        </div>
        <div className="board" role="grid" aria-label="Ludo board grid">
          {board.map((row, ri) => row.map((cell, ci) => (
            <div key={`${ri}-${ci}`} role="gridcell" aria-label={`Row ${ri+1} Column ${ci+1}`} className={cell.cls}>
              {gameState.pieces.map((p, i) => 
                p.position[0] === ri && p.position[1] === ci && (
                  <div key={i} className={`piece p-${p.color}`} />
                )
              )}
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
          <input 
            className="input" 
            placeholder="Type message" 
            value={input} 
            onChange={(e)=>setInput(e.target.value)} 
            aria-label="Chat message" 
          />
          <button className="btn" type="submit">Send</button>
        </form>
      </section>
    </div>
  );
}
