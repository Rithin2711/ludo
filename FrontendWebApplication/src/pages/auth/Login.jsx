import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../state/authStore';
import { validateLogin } from '../../utils/validators';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login form for email/mobile + password */
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateLogin({ identifier, password });
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      await login({ identifier, password });
      navigate('/rooms');
    } catch (_) {
      // error shown below
    }
  }

  return (
    <div className="card" role="region" aria-labelledby="login-title">
      <h1 id="login-title" className="card-title">Login</h1>
      {error && <div className="alert error" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <label className="small bold" htmlFor="identifier">Email or Mobile</label>
        <input
          id="identifier"
          className="input"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
          aria-invalid={!!fieldErrors.identifier}
          aria-describedby={fieldErrors.identifier ? 'identifier-err' : undefined}
        />
        {fieldErrors.identifier && <div id="identifier-err" className="small alert error" role="alert">{fieldErrors.identifier}</div>}

        <div style={{ height: 8 }} />
        <label className="small bold" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          aria-invalid={!!fieldErrors.password}
          aria-describedby={fieldErrors.password ? 'password-err' : undefined}
        />
        {fieldErrors.password && <div id="password-err" className="small alert error" role="alert">{fieldErrors.password}</div>}

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" disabled={loading} type="submit">{loading ? 'Signing in...' : 'Login'}</button>
          <Link className="btn secondary" to="/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}
