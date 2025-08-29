import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../state/authStore';
import { api } from '../services/api';

// PUBLIC_INTERFACE
export default function Profile() {
  /** Manage profile details and avatar */
  const { user, token, loadSession } = useAuthStore();
  const [form, setForm] = useState({ username: '', bio: '' });
  const [avatar, setAvatar] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { loadSession(); }, [loadSession]);
  useEffect(() => { if (user) setForm({ username: user.username || '', bio: user.bio || '' }); }, [user]);

  function update(k, v){ setForm((f) => ({ ...f, [k]: v })); }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true); setMessage('');
    try {
      await api.profile.update({ ...form, avatarUrl: avatar }, token);
      setMessage('Profile updated');
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid cols-2">
      <section className="card">
        <div className="card-title">Your Profile</div>
        {message && <div className={`alert ${message.includes('updated') ? 'success' : 'error'}`} role="alert">{message}</div>}
        <form onSubmit={saveProfile} noValidate>
          <label className="small bold" htmlFor="username">Username</label>
          <input id="username" className="input" value={form.username} onChange={(e)=>update('username', e.target.value)} />
          <div style={{ height: 8 }} />
          <label className="small bold" htmlFor="bio">Bio</label>
          <textarea id="bio" className="input" rows={4} value={form.bio} onChange={(e)=>update('bio', e.target.value)} />
          <div style={{ height: 12 }} />
          <button className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </form>
      </section>
      <section className="card">
        <div className="card-title">Avatar</div>
        <div className="row" style={{ marginBottom: 8 }}>
          <img src={avatar || 'https://placehold.co/96x96?text=Avatar'} alt="Avatar preview" width={96} height={96} style={{ borderRadius: 12, border: '1px solid var(--border)' }} />
        </div>
        <label className="small bold" htmlFor="avatar">Avatar URL</label>
        <input id="avatar" className="input" value={avatar} onChange={(e)=>setAvatar(e.target.value)} placeholder="https://..." />
        <p className="muted small">Paste an image URL. If backend supports uploads, integrate signed URL here.</p>
      </section>
    </div>
  );
}
