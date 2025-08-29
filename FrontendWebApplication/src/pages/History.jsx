import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../state/authStore';

// PUBLIC_INTERFACE
export default function History() {
  /** Player's match history */
  const { token } = useAuthStore();
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.gameplay.history(token).then((data)=> setRows(data.history || [])).catch(()=>{});
  }, [token]);
  return (
    <section className="card">
      <div className="card-title">Match History</div>
      <table className="table" role="table">
        <thead><tr><th>Date</th><th>Result</th><th>Opponents</th></tr></thead>
        <tbody>
          {rows.map((r)=>(
            <tr key={r.id}>
              <td>{new Date(r.endedAt || r.startedAt).toLocaleString()}</td>
              <td>{r.result}</td>
              <td>{(r.opponents || []).map(o=>o.username).join(', ')}</td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan="3" className="muted">No matches yet</td></tr>}
        </tbody>
      </table>
    </section>
  );
}
