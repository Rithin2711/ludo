import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../state/authStore';
import { validateRegistration } from '../../utils/validators';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration with email or mobile, username, password */
  const [form, setForm] = useState({ email: '', mobile: '', username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateRegistration(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      await register(form);
      navigate('/rooms');
    } catch (_) {
      // error displayed
    }
  }

  return (
    <div className="card" role="region" aria-labelledby="reg-title">
      <h1 id="reg-title" className="card-title">Create account</h1>
      <p className="muted small">Use email or mobile. Password min 6 chars.</p>
      {error && <div className="alert error" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid cols-2">
          <div>
            <label className="small bold" htmlFor="email">Email</label>
            <input id="email" className="input" value={form.email} onChange={(e)=>update('email', e.target.value)} autoComplete="email" aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email?'email-err':undefined}/>
            {fieldErrors.email && <div id="email-err" className="small alert error" role="alert">{fieldErrors.email}</div>}
          </div>
          <div>
            <label className="small bold" htmlFor="mobile">Mobile</label>
            <input id="mobile" className="input" value={form.mobile} onChange={(e)=>update('mobile', e.target.value)} autoComplete="tel" aria-invalid={!!fieldErrors.mobile} aria-describedby={fieldErrors.mobile?'mobile-err':undefined}/>
            {fieldErrors.mobile && <div id="mobile-err" className="small alert error" role="alert">{fieldErrors.mobile}</div>}
          </div>
        </div>

        <div style={{ height: 8 }} />
        <label className="small bold" htmlFor="username">Username</label>
        <input id="username" className="input" value={form.username} onChange={(e)=>update('username', e.target.value)} autoComplete="nickname" aria-invalid={!!fieldErrors.username} aria-describedby={fieldErrors.username?'username-err':undefined}/>
        {fieldErrors.username && <div id="username-err" className="small alert error" role="alert">{fieldErrors.username}</div>}

        <div style={{ height: 8 }} />
        <label className="small bold" htmlFor="password">Password</label>
        <input id="password" type="password" className="input" value={form.password} onChange={(e)=>update('password', e.target.value)} autoComplete="new-password" aria-invalid={!!fieldErrors.password} aria-describedby={fieldErrors.password?'password-err':undefined}/>
        {fieldErrors.password && <div id="password-err" className="small alert error" role="alert">{fieldErrors.password}</div>}

        {fieldErrors.contact && <div className="small alert error" role="alert">{fieldErrors.contact}</div>}

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
          <Link className="btn secondary" to="/login">Already have an account?</Link>
        </div>
      </form>
    </div>
  );
}
