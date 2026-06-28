import { useEffect, useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import api from '../services/api';
import ProgressRing from '../components/ProgressRing';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    api.get('/resume/latest')
      .then((res) => { if (res.data.data) setLatest(res.data.data); })
      .catch(() => {});
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data.data);
      setLatest(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const display = result || latest;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Resume Analyzer</h1>
      <p className="mb-8 text-slate-600">Upload your resume for ATS scoring and AI feedback</p>

      <div className="card mb-8">
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-slate-200 p-8">
          <Upload className="h-10 w-10 text-slate-400" />
          <p className="mt-4 text-sm text-slate-600">Upload PDF or DOCX resume</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-4 text-sm"
          />
          {file && (
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-700">
              <FileText className="h-4 w-4" /> {file.name}
            </p>
          )}
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="btn-primary mt-4"
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </div>
      </div>

      {display && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card text-center">
            <h3 className="mb-4 font-semibold">Resume Score</h3>
            <ProgressRing value={display.resumeScore} />
          </div>
          <div className="card text-center">
            <h3 className="mb-4 font-semibold">ATS Score</h3>
            <ProgressRing value={display.atsScore} />
          </div>
          <div className="card md:col-span-2">
            <h3 className="mb-3 font-semibold">Keywords Detected</h3>
            <div className="flex flex-wrap gap-2">
              {display.keywords?.split(', ').map((kw, i) => (
                <span key={i} className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700">
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <div className="card md:col-span-2">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <CheckCircle className="h-5 w-5 text-emerald-500" /> Recommendations
            </h3>
            <p className="text-slate-600">{display.feedback}</p>
          </div>
        </div>
      )}
    </div>
  );
}
