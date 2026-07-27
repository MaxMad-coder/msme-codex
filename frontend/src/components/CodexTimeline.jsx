import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://msme-codex.onrender.com';

export default function CodexTimeline() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/codex-logs`)
      .then((response) => {
        setEntries(response.data.entries || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load Codex session timeline.');
        setLoading(false);
      });
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Codex usage</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Session timeline</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{entries.length} sessions</span>
      </div>

      <div className="mt-5 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-600">Loading timeline...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : entries.length ? (
          entries.slice(0, 5).map((entry) => (
            <div key={entry.session} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{entry.session}</p>
              <p className="mt-3 text-sm font-semibold text-slate-900">{entry.goal}</p>
              {entry.planning?.length ? (
                <p className="mt-2 text-sm text-slate-600">{entry.planning[0]}</p>
              ) : null}
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">No Codex timeline entries found yet.</p>
        )}
      </div>
    </section>
  );
}
