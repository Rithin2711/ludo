import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../state/authStore';
import { Link, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Rooms() {
  /** List rooms, create, and quick join */
  const { token } = useAuthStore();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ name: '', isPrivate: false, password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(k, v){ setForm((f) => ({ ...f, [k]: v })); }

  async function load() {
    setLoading(true);
    try {
      const data = await api.rooms.list(token);
      setRooms(data.rooms || []);
    } catch (e) { /* show minimal */ }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [load]);

  async function createRoom(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.rooms.create(form, token);
      navigate(`/rooms/${data.room.id}`);
    } catch (e) {
      alert(e.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="grid cols-2">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Rooms</div>
            <div className="card-subtitle">{loading ? 'Loading...' : `${rooms.length} active`}</div>
          </div>
          <button className="btn secondary" onClick={load} aria-label="Refresh rooms">Refresh</button>
        </div>
        <table className="table" role="table" aria-label="Available rooms">
          <thead>
            <tr><th>Name</th><th>Players</th><th>Privacy</th><th>Action</th></tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.playerCount || 0}/4</td>
                <td>{r.isPrivate ? 'Private' : 'Public'}</td>
                <td className="row">
                  <Link className="btn secondary" to={`/rooms/${r.id}`}>Open</Link>
                </td>
              </tr>
            ))}
            {!rooms.length && !loading && <tr><td colSpan="4" className="muted">No rooms yet. Create one!</td></tr>}
          </tbody>
        </table>
      </section>
      <section className="card">
        <div className="card-title">Create Room</div>
        <form onSubmit={createRoom}>
          <label className="small bold" htmlFor="name">Name</label>
          <input id="name" className="input" value={form.name} onChange={(e)=>update('name', e.target.value)} required />
          <div style={{ height: 8 }} />
          <label className="small bold" htmlFor="privacy">Privacy</label>
          <select id="privacy" className="input" value={form.isPrivate ? 'private' : 'public'} onChange={(e)=>update('isPrivate', e.target.value==='private')}>
            <option value="public">Public</option>
            <option value="private">Private (password)</option>
          </select>
          {form.isPrivate && (
            <>
              <div style={{ height: 8 }} />
              <label className="small bold" htmlFor="password">Password</label>
              <input id="password" className="input" value={form.password} onChange={(e)=>update('password', e.target.value)} />
            </>
          )}
          <div style={{ height: 12 }} />
          <button className="btn" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
        </form>
      </section>
    </div>
  );
}
