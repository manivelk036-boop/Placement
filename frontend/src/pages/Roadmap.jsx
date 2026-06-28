import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import api from '../services/api';

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students/me/roadmap')
      .then((res) => setRoadmap(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'No roadmap found'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="card">
          <p className="text-slate-600">{error}</p>
          <Link to="/career-goal" className="btn-primary mt-4 inline-flex">
            Select Career Goal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{roadmap?.title}</h1>
          <p className="mt-1 text-slate-600">Your personalized learning journey</p>
        </div>
        <div className="rounded-lg bg-primary-50 px-4 py-2">
          <span className="text-sm font-medium text-primary-700">
            {roadmap?.progressPercent}% Complete
          </span>
        </div>
      </div>

      <div className="relative space-y-6 before:absolute before:left-6 before:top-0 before:h-full before:w-0.5 before:bg-slate-200">
        {roadmap?.months?.map((month) => (
          <div key={month.monthNumber} className="relative pl-16">
            <div className={`absolute left-3 flex h-7 w-7 items-center justify-center rounded-full ${
              month.completed ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-primary-500'
            }`}>
              {month.completed ? <CheckCircle2 className="h-4 w-4" /> : <Calendar className="h-3.5 w-3.5 text-primary-600" />}
            </div>

            <div className="card">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                    Month {month.monthNumber}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">{month.title}</h3>
                </div>
              </div>

              <ul className="grid gap-2 sm:grid-cols-2">
                {month.topics?.map((topic, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <Circle className="h-3 w-3 text-slate-300" />
                    {topic}
                  </li>
                ))}
              </ul>

              <Link to="/learning" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
                Start learning →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
