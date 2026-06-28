import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Left hero panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-violet-600 blur-[100px]" />
          <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-indigo-600 blur-[100px]" />
        </div>
        <div className="relative flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
            <Rocket className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">CareerPilot AI</span>
        </div>
        <div className="relative">
          <h1 className="text-5xl font-extrabold leading-tight text-white">
            Learn, Practice,<br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Track & Get Placed.
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-md">
            Your personal AI placement coach. Build skills, practice interviews, and land your dream job.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[['10K+', 'Students'], ['95%', 'Placement Rate'], ['500+', 'Companies']].map(([v, l]) => (
              <div key={l} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-2xl font-extrabold text-white">{v}</p>
                <p className="text-xs text-slate-400 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-sm text-slate-600">© 2026 CareerPilot AI</p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">CareerPilot AI</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white">Welcome back</h2>
          <p className="mt-2 text-slate-400">Sign in to continue your placement journey</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl border border-rose-800/60 bg-rose-900/30 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn-primary w-full py-3 text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-violet-400 hover:text-violet-300">
              Register free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
