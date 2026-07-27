import { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://msme-codex.onrender.com';

export default function ReportGenerator() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/report/weekly`);
      setReport(response.data.report);
    } catch (caught) {
      setError('Unable to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/report/weekly/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'weekly_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Unable to download the PDF report.');
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Weekly report</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Report generator</h2>
        </div>
        <button
          type="button"
          onClick={fetchReport}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {report ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Sales</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">₹{report.summary.total_sales}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Expenses</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">₹{report.summary.total_expenses}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Profit</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">₹{report.summary.profit}</p>
          </div>
          <button
            type="button"
            onClick={downloadPdf}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Download PDF
          </button>
        </div>
      ) : null}
    </section>
  );
}
