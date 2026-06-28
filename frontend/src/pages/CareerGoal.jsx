import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Layers, BarChart3, Brain, Palette, Cloud } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const goals = [
  { value: 'JAVA_DEVELOPER', label: 'Java Developer', icon: Code, color: 'bg-orange-100 text-orange-600' },
  { value: 'FULL_STACK_DEVELOPER', label: 'Full Stack Developer', icon: Layers, color: 'bg-blue-100 text-blue-600' },
  { value: 'DATA_ANALYST', label: 'Data Analyst', icon: BarChart3, color: 'bg-emerald-100 text-emerald-600' },
  { value: 'AI_ENGINEER', label: 'AI Engineer', icon: Brain, color: 'bg-violet-100 text-violet-600' },
  { value: 'UI_UX_DESIGNER', label: 'UI/UX Designer', icon: Palette, color: 'bg-pink-100 text-pink-600' },
  { value: 'CLOUD_ENGINEER', label: 'Cloud Engineer', icon: Cloud, color: 'bg-cyan-100 text-cyan-600' },
];

export default function CareerGoal() {
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { refreshStudent } = useAuth();

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      await api.post(`/students/me/career-goal?goal=${selected}`);
      await refreshStudent();
      navigate('/roadmap');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set career goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Choose Your Career Goal</h1>
        <p className="mt-2 text-slate-600">
          Select a path and we&apos;ll generate a personalized AI roadmap for you
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map(({ value, label, icon: Icon, color }) => (
          <button
            key={value}
            onClick={() => setSelected(value)}
            className={`card text-left transition ${
              selected === value
                ? 'border-primary-500 ring-2 ring-primary-500/20'
                : 'hover:border-slate-300'
            }`}
          >
            <div className={`mb-3 inline-flex rounded-lg p-2.5 ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <p className="font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-sm text-slate-500">7-month personalized roadmap</p>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!selected || loading}
          className="btn-primary px-8"
        >
          {loading ? 'Generating Roadmap...' : 'Generate AI Roadmap'}
        </button>
      </div>
    </div>
  );
}
