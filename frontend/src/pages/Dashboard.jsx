import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Coins, Flame, Target, ArrowRight, Award,
  BookOpen, Mic, FileText, Building2, TrendingUp,
} from 'lucide-react';
import api from '../services/api';

function StatCard({ title, value, subtitle, icon: Icon, gradient }) {
  return (
    <div className={`card relative overflow-hidden`}>
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${gradient}`} />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="stat-label">{title}</p>
            <p className="stat-value mt-1">{value ?? '—'}</p>
            {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ value, size = 120, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#grad)" strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-2xl font-extrabold text-white">{value}%</span>
    </div>
  );
}

const quickActions = [
  { to: '/learning', icon: BookOpen, label: 'Start Learning', desc: 'Explore your roadmap topics', gradient: 'from-violet-600 to-indigo-600' },
  { to: '/mock-interview', icon: Mic, label: 'Mock Interview', desc: 'Sharpen your answers', gradient: 'from-indigo-600 to-blue-600' },
  { to: '/resume', icon: FileText, label: 'Resume Analyzer', desc: 'Boost your ATS score', gradient: 'from-emerald-600 to-teal-600' },
  { to: '/companies', icon: Building2, label: 'Company Match', desc: 'Find target companies', gradient: 'from-amber-600 to-orange-600' },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students/me/dashboard')
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-64 rounded-xl" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const student = data?.student;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{student?.name?.split(' ')[0]}!</span>
          </h1>
          <p className="mt-1.5 text-slate-400">Track your progress and stay placement-ready.</p>
        </div>
        <Link to="/placement-score" className="btn-secondary hidden sm:flex">
          <TrendingUp className="h-4 w-4" />
          Readiness Score
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="XP Points"
          value={student?.xp?.toLocaleString()}
          subtitle={student?.level?.replace(/_/g, ' ')}
          icon={Zap}
          gradient="from-violet-600 to-indigo-600"
        />
        <StatCard
          title="Career Coins"
          value={student?.coins?.toLocaleString()}
          icon={Coins}
          gradient="from-amber-500 to-orange-600"
        />
        <StatCard
          title="Daily Streak"
          value={`${student?.streak ?? 0} days`}
          icon={Flame}
          gradient="from-rose-500 to-orange-500"
        />
        <StatCard
          title="Placement Score"
          value={`${student?.placementScore ?? 0}/100`}
          icon={Target}
          gradient="from-emerald-500 to-teal-600"
        />
      </div>

      {/* Mid row: Readiness + Roadmap + Tasks */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Placement Ring */}
        <div className="card text-center">
          <h2 className="section-title mb-4">Placement Readiness</h2>
          <div className="flex justify-center">
            <ProgressRing value={student?.placementScore ?? 0} />
          </div>
          <p className="mt-3 text-sm text-slate-400">
            {student?.placementScore >= 75 ? '🚀 Interview-ready!' : 'Keep practicing to improve'}
          </p>
          <Link to="/placement-score" className="mt-4 btn-ghost w-full justify-center text-violet-400 hover:text-violet-300">
            View details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Roadmap Progress */}
        <div className="card">
          <h2 className="section-title mb-4">Roadmap Progress</h2>
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-slate-400">Completed</span>
            <span className="font-bold text-white">{data?.roadmapProgress ?? 0}%</span>
          </div>
          <div className="progress-bar mb-1">
            <div className="progress-fill" style={{ width: `${data?.roadmapProgress ?? 0}%` }} />
          </div>
          <p className="mt-4 text-sm text-slate-400">
            <span className="font-semibold text-white">{data?.topicsCompleted ?? 0}</span> of{' '}
            <span className="font-semibold text-white">{data?.totalTopics ?? 0}</span> topics completed
          </p>
          <Link to="/roadmap" className="mt-4 btn-ghost w-full justify-center text-violet-400 hover:text-violet-300">
            View roadmap <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Upcoming Tasks */}
        <div className="card">
          <h2 className="section-title mb-4">Upcoming Tasks</h2>
          <ul className="space-y-3">
            {data?.upcomingTasks?.map((task, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-slate-800/40 p-3 text-sm text-slate-300">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-900/60 text-xs font-bold text-violet-300">
                  {i + 1}
                </span>
                {task}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Achievements */}
      {data?.recentAchievements?.length > 0 && (
        <div className="card">
          <h2 className="section-title mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" /> Recent Achievements
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.recentAchievements.map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-900/60 p-4">
                <span className="text-3xl">{a.icon}</span>
                <div>
                  <p className="font-semibold text-white text-sm">{a.badgeName}</p>
                  <p className="text-xs text-slate-400">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="section-title mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((item) => (
            <Link key={item.to} to={item.to} className="card-hover group cursor-pointer">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <p className="font-semibold text-white group-hover:text-violet-300 transition-colors">{item.label}</p>
              <p className="mt-0.5 text-xs text-slate-400">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
