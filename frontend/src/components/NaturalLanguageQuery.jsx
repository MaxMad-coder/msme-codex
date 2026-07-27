import { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://msme-codex.onrender.com';

export default function NaturalLanguageQuery() {
  const [query, setQuery] = useState('Who owes me money?');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/api/nl-query`, { query });
      setAnswer(response.data.answer);
    } catch (caught) {
      setError(caught.response?.data?.error || 'Unable to process the query.');
      setAnswer(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Natural language query</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Ask business questions like "Who owes me money?" and get a data-backed answer.</p>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <textarea
          rows="3"
          className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
          <p className="text-sm text-slate-500">Try: "Who owes me money?" or "Profit last month".</p>
        </div>
      </form>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {answer ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Answer</p>
          <p className="mt-3 text-base leading-7 text-slate-700">{answer.finding}</p>
          <p className="mt-2 text-sm font-medium text-slate-900">{answer.recommendation}</p>
          {answer.results?.length ? (
            <div className="mt-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Results:</p>
              <pre className="mt-2 overflow-x-auto rounded-2xl bg-white p-3 text-xs text-slate-700">{JSON.stringify(answer.results, null, 2)}</pre>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
