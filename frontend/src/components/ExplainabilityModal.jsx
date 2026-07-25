export default function ExplainabilityModal({ open, onClose, reasoning_chain = [] }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Why this recommendation?</h2>
            <p className="mt-1 text-sm text-slate-500">Each agent step is shown below with its finding and recommendation.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200"
          >
            Close
          </button>
        </div>
        <div className="max-h-[78vh] overflow-y-auto p-6">
          {reasoning_chain.length ? (
            <div className="space-y-4">
              {reasoning_chain.map((item) => (
                <div key={item.agent} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.agent}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{item.finding}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{item.recommendation}</p>
                  {item.reasoning?.length ? (
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      {item.reasoning.map((line, index) => (
                        <p key={index}>• {line}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">No reasoning chain is available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
