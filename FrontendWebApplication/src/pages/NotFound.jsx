import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function NotFound() {
  /** 404 page */
  return (
    <section className="card center">
      <div className="card-title">Page not found</div>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link className="btn" to="/">Go home</Link>
    </section>
  );
}
