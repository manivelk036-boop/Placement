import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Video, ClipboardList, Code2, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import api from '../services/api';

const activities = [
  { key: 'notes', icon: BookOpen, label: 'Read Notes', xp: '+5 XP', color: 'from-violet-600 to-indigo-600' },
  { key: 'video', icon: Video, label: 'Watch Tutorial', xp: '+5 XP', color: 'from-indigo-600 to-blue-600' },
  { key: 'assignment', icon: ClipboardList, label: 'Assignment', xp: '+75 XP', color: 'from-emerald-600 to-teal-600' },
  { key: 'project', icon: Code2, label: 'Mini Project', xp: '+200 XP', color: 'from-amber-500 to-orange-600' },
];

function TopicCard({ topic, progress, onActivity, onQuiz }) {
  const comp = progress?.completed;
  return (
    <div className={`card transition-all duration-300 ${comp ? 'border-emerald-800/40' : 'hover:border-slate-700'}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {comp && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
            <h3 className="font-bold text-white">{topic.title}</h3>
          </div>
          <p className="mt-1 text-sm text-slate-400">Month {topic.monthNumber}</p>
        </div>
        <span className={`badge ${comp ? 'badge-emerald' : 'badge-violet'}`}>
          {comp ? 'Done' : 'In Progress'}
        </span>
      </div>

      <p className="mb-4 text-sm text-slate-400">{topic.description}</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {activities.map(({ key, icon: Icon, label, xp, color }) => {
          const done = progress?.[key === 'notes' ? 'notesRead' : key === 'video' ? 'videoWatched' : key === 'assignment' ? 'assignmentDone' : 'projectDone'];
          return (
            <button
              key={key}
              onClick={() => !done && onActivity(topic.id, key)}
              disabled={done}
              className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium transition-all
                ${done
                  ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-800/40 cursor-not-allowed'
                  : `bg-gradient-to-r ${color} text-white hover:opacity-90 hover:-translate-y-0.5`
                }`}
            >
              {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              <span className="truncate">{done ? `✓ ${label}` : label}</span>
              {!done && <span className="ml-auto text-white/70">{xp}</span>}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onQuiz(topic.id)}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
      >
        Take Quiz <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Learning() {
  const [topics, setTopics] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/learning/topics')
      .then((res) => {
        const data = res.data.data || [];
        setTopics(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleActivity = async (topicId, activity) => {
    setActioning(`${topicId}-${activity}`);
    try {
      const res = await api.post(`/learning/topics/${topicId}/activity?activity=${activity}`);
      const prog = res.data.data;
      setProgressMap((prev) => ({ ...prev, [topicId]: prog }));
    } catch (e) {
      console.error(e);
    } finally {
      setActioning(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-48 rounded-xl" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Lock className="h-12 w-12 text-slate-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Topics Yet</h2>
        <p className="text-slate-400 mb-6">Set your career goal first to unlock your personalized learning roadmap.</p>
        <button onClick={() => navigate('/career-goal')} className="btn-primary">
          Set Career Goal
        </button>
      </div>
    );
  }

  const byMonth = topics.reduce((acc, t) => {
    const m = t.monthNumber;
    if (!acc[m]) acc[m] = [];
    acc[m].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Learning Hub</h1>
        <p className="mt-1 text-slate-400">Complete activities to earn XP and career coins.</p>
      </div>

      {Object.entries(byMonth).map(([month, monthTopics]) => (
        <div key={month}>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-900/60 text-sm font-bold text-violet-300">
              {month}
            </div>
            <h2 className="text-lg font-bold text-white">Month {month}</h2>
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-500">{monthTopics.length} topics</span>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {monthTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                progress={progressMap[topic.id]}
                onActivity={handleActivity}
                onQuiz={(id) => navigate(`/quiz/${id}`)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
