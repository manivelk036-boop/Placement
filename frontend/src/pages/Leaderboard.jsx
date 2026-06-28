import { useEffect, useState } from 'react';
import { Trophy, Zap, Coins, Flame, Target } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const metrics = [
  { key: 'xp', label: 'XP', icon: Zap },
  { key: 'coins', label: 'Coins', icon: Coins },
  { key: 'streak', label: 'Streak', icon: Flame },
  { key: 'placement', label: 'Placement', icon: Target },
];

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [metric, setMetric] = useState('xp');
  const [loading, setLoading] = useState(true);
  const { student } = useAuth();

  useEffect(() => {
    setLoading(true);
    api.get(`/students/leaderboard?metric=${metric}`)
      .then((res) => setEntries(res.data.data || []))
      .finally(() => setLoading(false));
  }, [metric]);

  const getValue = (entry) => {
    switch (metric) {
      case 'coins': return entry.coins;
      case 'streak': return `${entry.streak}d`;
      case 'placement': return entry.placementScore;
      default: return entry.xp;
    }
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Leaderboard</h1>
      <p className="mb-6 text-slate-600">Compare your progress with other students</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {metrics.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMetric(key)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              metric === key ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">College</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-500">{metric.toUpperCase()}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <tr
                  key={entry.studentId}
                  className={entry.studentId === student?.id ? 'bg-primary-50' : ''}
                >
                  <td className="px-6 py-4">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      entry.rank === 1 ? 'bg-amber-100 text-amber-700' :
                      entry.rank === 2 ? 'bg-slate-200 text-slate-700' :
                      entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {entry.rank <= 3 ? <Trophy className="h-4 w-4" /> : entry.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {entry.name}
                    {entry.studentId === student?.id && (
                      <span className="ml-2 text-xs text-primary-600">(You)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{entry.college || '—'}</td>
                  <td className="px-6 py-4 text-right font-semibold text-primary-600">
                    {getValue(entry)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
