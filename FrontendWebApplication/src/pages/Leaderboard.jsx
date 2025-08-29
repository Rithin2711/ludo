import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

// PUBLIC_INTERFACE
export default function Leaderboard() {
  /** Shows top players via REST */
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.gameplay.leaderboard().then((data) => setRows(data.leaderboard || [])).catch(()=>{});
  }, []);
  return (
    <section className="card">
      <div className="card-title">Leaderboards</div>
      <table className="table" role="table">
        <thead><tr><th>Player</th><th>Rating</th><th>Wins</th><th>Games</th></tr></thead>
        <tbody>
          {rows.map((r)=>(
            <tr key={r.userId}>
              <td>{r.username}</td>
              <td>{r.rating}</td>
              <td>{r.wins}</td>
              <td>{r.games}</td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan="4" className="muted">No data</td></tr>}
        </tbody>
      </table>
    </section>
  );
}
