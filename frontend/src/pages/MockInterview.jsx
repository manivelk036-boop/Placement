import { useEffect, useState } from 'react';
import { Mic, Send } from 'lucide-react';
import api from '../services/api';

export default function MockInterview() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('MIXED');

  useEffect(() => {
    api.get(`/mock-interview/generate?type=${type}`)
      .then((res) => setQuestions(res.data.data.questions || []));
  }, [type]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/mock-interview/submit?type=${type}`, answers, {
        headers: { 'Content-Type': 'text/plain' },
      });
      setResult(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-slate-900">Interview Complete</h1>
          <p className="mt-4 text-5xl font-bold text-primary-600">{result.score}/100</p>
          <p className="mt-4 text-slate-600">{result.feedback}</p>
          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-left">
            <h3 className="font-semibold">Improvement Plan</h3>
            <p className="mt-2 text-sm text-slate-600">{result.improvementPlan}</p>
          </div>
          <p className="mt-4 text-sm text-amber-600">+75 Career Coins earned!</p>
          <button onClick={() => { setResult(null); setAnswers(''); }} className="btn-primary mt-6">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">AI Mock Interview</h1>
      <p className="mb-6 text-slate-600">Practice HR, technical, and situational questions</p>

      <div className="mb-6 flex gap-2">
        {['MIXED', 'HR', 'TECHNICAL'].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              type === t ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="card mb-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <Mic className="h-5 w-5 text-primary-600" /> Questions
        </h2>
        <ol className="list-decimal space-y-3 pl-5 text-slate-700">
          {questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ol>
      </div>

      <div className="card">
        <label className="label">Your Answers</label>
        <textarea
          className="input-field min-h-[200px]"
          placeholder="Type your answers here. Address each question clearly..."
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={!answers.trim() || loading}
          className="btn-primary mt-4 inline-flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          {loading ? 'Evaluating...' : 'Submit Interview'}
        </button>
      </div>
    </div>
  );
}
