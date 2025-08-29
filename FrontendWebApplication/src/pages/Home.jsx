import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';

// PUBLIC_INTERFACE
export default function Home() {
  /** Landing page with quick actions */
  const { user, loadSession } = useAuthStore();
  useEffect(() => { loadSession(); }, [loadSession]);

  return (
    <div className="grid cols-2">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Welcome to LudoMaster</div>
            <div className="card-subtitle">Play classic Ludo with friends or AI</div>
          </div>
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          {user ? (
            <>
              <Link className="btn" to="/rooms">Join a Room</Link>
              <Link className="btn secondary" to="/profile">Profile</Link>
            </>
          ) : (
            <>
              <Link className="btn" to="/register">Create account</Link>
              <Link className="btn secondary" to="/login">Login</Link>
            </>
          )}
        </div>
      </section>
      <section className="card">
        <div className="card-title">Leaderboards</div>
        <p className="muted small">See who’s on top this week</p>
        <Link className="btn secondary" to="/leaderboard" aria-label="View leaderboards">View</Link>
      </section>
    </div>
  );
}
