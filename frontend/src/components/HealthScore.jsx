const COLOR_MAP = {
  good: 'bg-emerald-100 text-emerald-800',
  warn: 'bg-amber-100 text-amber-800',
  bad: 'bg-rose-100 text-rose-800',
};

function scoreClass(score) {
  if (score >= 75) return COLOR_MAP.good;
  if (score >= 50) return COLOR_MAP.warn;
  return COLOR_MAP.bad;
}

function computeScore(outputs) {
  if (!outputs || !outputs.length) {
    return {
      overall: 0,
      inventory: 0,
      cash: 0,
      sales: 0,
      expenses: 0,
    };
  }

  const inventory = outputs.find((item) => item.agent === 'inventory');
  const finance = outputs.find((item) => item.agent === 'finance');
  const sales = outputs.find((item) => item.agent === 'sales');
  const negativeExpense = outputs.find((item) => item.agent === 'expenses');

  const invScore = inventory ? Math.round((inventory.confidence || 0) * 100) : 40;
  const cashScore = finance ? Math.round((finance.confidence || 0) * 100) : 45;
  const salesScore = sales ? Math.round((sales.confidence || 0) * 100) : 50;
  const expenseScore = negativeExpense ? Math.round((negativeExpense.confidence || 0) * 100) : 55;
  const overall = Math.round((invScore * 0.3) + (cashScore * 0.3) + (salesScore * 0.25) + (expenseScore * 0.15));

  return { overall, inventory: invScore, cash: cashScore, sales: salesScore, expenses: expenseScore };
}

export default function HealthScore({ outputs = [] }) {
  const scores = computeScore(outputs);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Business Health</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Overall score</h2>
        </div>
        <div className={`rounded-3xl px-4 py-2 text-sm font-semibold ${scoreClass(scores.overall)}`}>
          {scores.overall}%
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          { label: 'Inventory', value: scores.inventory },
          { label: 'Cash', value: scores.cash },
          { label: 'Sales', value: scores.sales },
          { label: 'Expenses', value: scores.expenses },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}%</p>
          </div>
        ))}
      </div>
    </section>
  );
}
