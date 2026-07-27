import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { translations } from './i18n.js';

const API_BASE = import.meta.env.VITE_API_URL || 'https://msme-codex.onrender.com';

const speechSupported = typeof window !== 'undefined' && 'SpeechRecognition' in window;
const SpeechRecognition = speechSupported ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export default function VoiceAssistant({ lang, setLang, setAnswerFromVoice }) {
  const [listening, setListening] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [error, setError] = useState(null);
  const [responseTime, setResponseTime] = useState(null);

  const t = translations[lang];

  const recognition = useMemo(() => {
    if (!SpeechRecognition) return null;
    const recog = new SpeechRecognition();
    recog.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    return recog;
  }, [lang]);

  useEffect(() => {
    if (!recognition) return undefined;

    const handleResult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setRecordedText(transcript);
      setListening(false);
      setError(null);
      const start = performance.now();
      try {
        const response = await axios.post(`${API_BASE}/api/ask`, { query: transcript });
        setAnswerFromVoice(response.data);
        setResponseTime(Math.round(performance.now() - start));
      } catch (caught) {
        setError(caught.response?.data?.error || 'Unable to process the voice query.');
      }
    };

    const handleError = (event) => {
      setListening(false);
      setError(event.error || 'Speech recognition failed.');
    };

    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('error', handleError);
    recognition.addEventListener('end', () => setListening(false));

    return () => {
      recognition.removeEventListener('result', handleResult);
      recognition.removeEventListener('error', handleError);
      recognition.removeEventListener('end', () => setListening(false));
    };
  }, [recognition, setAnswerFromVoice]);

  const startListening = () => {
    if (!recognition) {
      setError(t.app.voiceNotSupported);
      return;
    }
    setError(null);
    setRecordedText('');
    setResponseTime(null);
    setListening(true);
    recognition.start();
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{t.app.voiceHeading}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{t.app.voiceHeading}</h2>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">{t.app.languageLabel}: {lang === 'hi' ? 'Hindi' : 'English'}</div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">{t.app.voiceDescription}</p>

      <div className="mt-5 flex flex-col gap-3">
        <button
          type="button"
          className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          onClick={startListening}
          disabled={listening}
        >
          {listening ? t.app.voiceListening : t.app.voiceStart}
        </button>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
            onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
          >
            {lang === 'hi' ? 'English' : 'हिन्दी'}
          </button>
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{t.app.responseTime}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{responseTime ? `${responseTime} ms` : '—'}</p>
          </div>
        </div>

        {recordedText ? (
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Captured</p>
            <p>{recordedText}</p>
          </div>
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </section>
  );
}
