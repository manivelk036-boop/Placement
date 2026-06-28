import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, User, Mail, Lock, GraduationCap, Building, Calendar, Star, Target, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const careerGoals = [
  { value: 'JAVA_DEVELOPER', label: '☕ Java Developer' },
  { value: 'FULL_STACK_DEVELOPER', label: '🌐 Full Stack Developer' },
  { value: 'DATA_ANALYST', label: '📊 Data Analyst' },
  { value: 'AI_ENGINEER', label: '🤖 AI Engineer' },
  { value: 'UI_UX_DESIGNER', label: '🎨 UI/UX Designer' },
  { value: 'CLOUD_ENGINEER', label: '☁️ Cloud Engineer' },
];

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />}
        {children}
      </div>
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', department: '',
    college: '', year: '', cgpa: '', careerGoal: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        ...form,
        year: form.year ? parseInt(form.year) : null,
        cgpa: form.cgpa ? parseFloat(form.cgpa) : null,
        careerGoal: form.careerGoal || null,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-900/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-xl shadow-violet-900/50">
            <Rocket className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Create your account</h1>
          <p className="mt-2 text-slate-400">Start your AI-powered placement journey</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {error && (
            <div className="rounded-xl border border-rose-800/60 bg-rose-900/30 px-4 py-3 text-sm text-rose-300">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Full Name" icon={User}>
                <input
                  name="name"
                  className="input-field pl-10"
                  placeholder="Arjun Sharma"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Email address" icon={Mail}>
                <input
                  name="email"
                  type="email"
                  className="input-field pl-10"
                  placeholder="you@college.edu"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Field label="Department" icon={GraduationCap}>
              <input
                name="department"
                className="input-field pl-10"
                placeholder="Computer Science"
                value={form.department}
                onChange={handleChange}
              />
            </Field>

            <Field label="College" icon={Building}>
              <input
                name="college"
                className="input-field pl-10"
                placeholder="IIT / NIT / VIT..."
                value={form.college}
                onChange={handleChange}
              />
            </Field>

            <Field label="Year of Study" icon={Calendar}>
              <input
                name="year"
                type="number"
                min="1" max="5"
                className="input-field pl-10"
                placeholder="2"
                value={form.year}
                onChange={handleChange}
              />
            </Field>

            <Field label="CGPA" icon={Star}>
              <input
                name="cgpa"
                type="number"
                step="0.01"
                min="0" max="10"
                className="input-field pl-10"
                placeholder="8.5"
                value={form.cgpa}
                onChange={handleChange}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Career Goal (optional)" icon={Target}>
                <select
                  name="careerGoal"
                  className="input-field pl-10 appearance-none"
                  value={form.careerGoal}
                  onChange={handleChange}
                >
                  <option value="">Select your goal</option>
                  {careerGoals.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <button
            id="register-submit"
            type="submit"
            className="btn-primary w-full py-3 text-base"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating account...
              </span>
            ) : 'Create Account — Free'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
