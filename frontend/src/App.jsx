import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import HealthScore from './components/HealthScore.jsx';
import ExplainabilityModal from './components/ExplainabilityModal.jsx';
import CodexTimeline from './components/CodexTimeline.jsx';
import ReportGenerator from './components/ReportGenerator.jsx';
import NaturalLanguageQuery from './components/NaturalLanguageQuery.jsx';

// Use VITE_API_URL when set (Vercel), otherwise fall back to the Render backend URL
const API_BASE = import.meta.env.VITE_API_URL || 'https://msme-codex.onrender.com';

export default function App() {
  const [query, setQuery] = useState('Check sugar stock and reorder if needed');
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showWhy, setShowWhy] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/health`)
      .then((response) => {
        if (response.data?.status === 'ok') {
          setApiStatus('Online');
        } else {
          setApiStatus('Unavailable');
        }
      })
      .catch(() => setApiStatus('Offline'));
  }, []);

  const canAsk = useMemo(() => query.trim().length > 5 && !loading, [query, loading]);
  const undoAvailable = history.length > 0;

  const handleAsk = async (event) => {
    event.preventDefault();
    if (!canAsk) return;

    setError(null);
    setLoading(true);
    try {
      if (result) {
        setHistory((current) => [...current, result]);
      }
      const response = await axios.post(`${API_BASE}/api/ask`, { query });
      setResult(response.data);
      setShowWhy(true);
    } catch (caught) {
      setError(caught.response?.data?.error || 'Unable to reach the API.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => {
    if (!undoAvailable) return;
    setResult(history[history.length - 1]);
    setHistory((current) => current.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">MSME AI Copilot</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Business intelligence for kirana stores
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Ask about stock, cash, sales trends, GST impact, or customer messages and get a clear recommendation with reasoning.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-3xl bg-slate-100 p-4 text-sm text-slate-700 shadow-inner">
              <span className="font-semibold">Backend status:</span>
              <span className={apiStatus === 'Online' ? 'text-emerald-600' : 'text-amber-700'}>{apiStatus}</span>
            </div>
          </div>
        </header>

        <main className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Ask your business copilot</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter your question below and get a structured recommendation from the agent chain.
              </p>
              <form className="mt-6 space-y-4" onSubmit={handleAsk}>
                <label className="block text-sm font-medium text-slate-700" htmlFor="query">
                  Business question
                </label>
                <textarea
                  id="query"
                  rows="4"
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={!canAsk}
                      className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {loading ? 'Thinking...' : 'Ask Copilot'}
                    </button>
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={!undoAvailable}
                      className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Undo
                    </button>
                  </div>
                  <p className="text-sm text-slate-500">Tip: ask specifically about stock, cash, sales or GST.</p>
                </div>
              </form>

              {error ? (
                <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
            </div>

            {result ? (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Recommendation</p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">What the copilot recommends</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
                        Confidence: {(result.confidence ?? 0) * 100}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowWhy(true)}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Why?
                      </button>
                    </div>
                  </div>
                  <p className="mt-5 text-base leading-7 text-slate-700">{result.final_answer}</p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Agent outputs</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-900">Chain results</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                      {result.reasoning_chain?.length ?? 0} steps
                    </span>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {result.reasoning_chain?.map((item) => (
                      <div key={item.agent} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{item.agent}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-700">{item.finding}</p>
                        <p className="mt-2 text-sm font-medium text-slate-900">{item.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <aside className="space-y-6">
            <HealthScore outputs={result?.reasoning_chain ?? []} />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Starter prompts</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>• "Will I run out of rice this week?"</li>
                <li>• "Can I afford to reorder sunflower oil today?"</li>
                <li>• "How is tea demand trending?"</li>
                <li>• "Calculate GST on a sugar order."</li>
              </ul>
            </div>
          </aside>
        </main>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-6">
            <CodexTimeline />
            <ReportGenerator />
          </div>
          <div className="space-y-6">
            <NaturalLanguageQuery />
          </div>
        </div>
      </div>

      <ExplainabilityModal open={showWhy} onClose={() => setShowWhy(false)} reasoning_chain={result?.reasoning_chain ?? []} />
    </div>
  );
}
