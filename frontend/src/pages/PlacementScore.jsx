import { useEffect, useState } from 'react';
import api from '../services/api';
import ProgressRing from '../components/ProgressRing';

export default function PlacementScore() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students/me/placement-score')
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  const categories = [
    { label: 'Technical Skills', value: data?.technicalSkills, color: 'bg-primary-600' },
    { label: 'Communication', value: data?.communication, color: 'bg-violet-500' },
    { label: 'Problem Solving', value: data?.problemSolving, color: 'bg-emerald-500' },
    { label: 'Interview Readiness', value: data?.interviewReadiness, color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Placement Readiness Score</h1>
      <p className="mb-8 text-slate-600">Your comprehensive placement readiness analysis</p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card flex flex-col items-center lg:col-span-1">
          <h2 className="mb-4 font-semibold">Overall Score</h2>
          <ProgressRing value={data?.overallScore || 0} size={160} stroke={12} />
          <p className="mt-4 text-sm text-slate-500">
            {data?.overallScore >= 80 ? 'Placement Ready!' : 'Keep improving'}
          </p>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="mb-6 font-semibold">Score Breakdown</h2>
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600">{cat.label}</span>
                  <span className="font-semibold">{cat.value}/100</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${cat.color} transition-all`}
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data?.weakAreas?.length > 0 && (
        <div className="mt-6 card">
          <h2 className="mb-3 font-semibold text-red-600">Weak Areas</h2>
          <div className="flex flex-wrap gap-2">
            {data.weakAreas.map((area) => (
              <span key={area} className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-700">
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {data?.careerTwinPredictions && (
        <div className="mt-6 card">
          <h2 className="mb-4 font-semibold">AI Career Twin – Growth Predictions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(data.careerTwinPredictions).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">{key}</p>
                <p className="mt-1 text-2xl font-bold text-primary-600">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
