import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../state/authStore';

// PUBLIC_INTERFACE
export default function RoomDetail() {
  /** Room lobby page: join/leave, start game navigation */
  const { id } = useParams();
  const { token } = useAuthStore();
  const [room, setRoom] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const data = await api.rooms.get(id, token);
      setRoom(data.room);
    } catch (e) { /* minimal */ }
    finally { setLoading(false); }
  }
  useEffect(()=>{ load(); }, [id, load]);

  async function join() {
    setLoading(true);
    try {
      await api.rooms.join(id, { password }, token);
      await load();
    } catch (e) {
      alert(e.message);
    } finally { setLoading(false); }
  }

  async function leave() {
    setLoading(true);
    try {
      await api.rooms.leave(id, token);
      navigate('/rooms');
    } catch (e) {
      alert(e.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="grid cols-2">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{room?.name || 'Room'}</div>
            <div className="card-subtitle">{room?.isPrivate ? 'Private' : 'Public'}</div>
          </div>
          <Link className="btn secondary" to="/rooms">Back</Link>
        </div>
        {room?.isPrivate && (
          <>
            <label className="small bold" htmlFor="pwd">Password</label>
            <input id="pwd" className="input" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </>
        )}
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn" onClick={join} disabled={loading}>Join</button>
          <button className="btn secondary" onClick={leave} disabled={loading}>Leave</button>
          <button className="btn" onClick={()=>navigate(`/game/${id}`)}>Start/Enter Game</button>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="card-subtitle">Players</div>
          <ul>
            {(room?.players || []).map((p)=> <li key={p.id}>{p.username}</li>)}
          </ul>
        </div>
      </section>
      <section className="card">
        <div className="card-title">Lobby Chat</div>
        <p className="muted small">Chat is available inside the game view.</p>
      </section>
    </div>
  );
}
