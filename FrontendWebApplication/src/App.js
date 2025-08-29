import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

import { useAuthStore } from './state/authStore';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import History from './pages/History';
import NotFound from './pages/NotFound';

// PUBLIC_INTERFACE
function App() {
  /** App Shell with routing and auth-gated routes */
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="container" role="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
            <Route path="/rooms/:id" element={<PrivateRoute><RoomDetail /></PrivateRoute>} />
            <Route path="/game/:id" element={<PrivateRoute><Game /></PrivateRoute>} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <div id="live-announcer" aria-live="polite" className="visually-hidden" />
      </div>
    </BrowserRouter>
  );
}

function Navbar() {
  const { user, logout } = useAuthStore();
  return (
    <nav className="navbar" aria-label="Primary">
      <div className="brand">
        <span className="logo" aria-hidden="true"></span>
        <Link to="/" className="bold" aria-label="LudoMaster home">LudoMaster</Link>
      </div>
      <div className="nav-actions" role="navigation" aria-label="User">
        <Link className="btn ghost" to="/leaderboard">Leaderboards</Link>
        {user ? (
          <>
            <Link className="btn secondary" to="/rooms">Rooms</Link>
            <Link className="btn secondary" to="/history">History</Link>
            <Link className="btn secondary" to="/profile" aria-label="Profile">Hi, {user.username || user.email}</Link>
            <button className="btn danger" onClick={logout} aria-label="Logout">Logout</button>
          </>
        ) : (
          <>
            <Link className="btn secondary" to="/login">Login</Link>
            <Link className="btn" to="/register">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function PrivateRoute({ children }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function GuestOnly({ children }) {
  const { user } = useAuthStore();
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default App;
