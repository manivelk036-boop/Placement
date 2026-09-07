import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, BookOpen, FileText, Mic,
  BarChart3, Building2, DollarSign, Trophy, User,
  Settings, LogOut, Rocket, Menu, X, Zap, Coins, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/career-goal', icon: Rocket, label: 'Career Goal' },
      { to: '/roadmap', icon: Map, label: 'Roadmap' },
    ],
  },
  {
    label: 'Learn & Practice',
    items: [
      { to: '/learning', icon: BookOpen, label: 'Learning' },
      { to: '/mock-interview', icon: Mic, label: 'Mock Interview' },
      { to: '/resume', icon: FileText, label: 'Resume Analyzer' },
    ],
  },
  {
    label: 'Career Analytics',
    items: [
      { to: '/placement-score', icon: BarChart3, label: 'Placement Score' },
      { to: '/companies', icon: Building2, label: 'Companies' },
      { to: '/salary', icon: DollarSign, label: 'Salary Predictor' },
      { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/profile', icon: User, label: 'Profile' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        isActive ? 'nav-active' : 'nav-inactive'
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function Layout({ children }) {
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const levelColors = {
    CAREER_EXPLORER: 'text-slate-400',
    LEARNER: 'text-sky-400',
    DEVELOPER: 'text-violet-400',
    PROBLEM_SOLVER: 'text-indigo-400',
    PLACEMENT_READY: 'text-emerald-400',
    INTERVIEW_MASTER: 'text-amber-400',
    CAREER_CHAMPION: 'text-rose-400',
  };

  const Sidebar = ({ onClose }) => (
    <div className="flex h-full flex-col bg-slate-950 border-r border-slate-800/60">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-800/60">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-lg shadow-violet-900/50">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">CareerPilot AI</p>
          <p className="text-xs text-violet-400">Placement Coach</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto rounded-lg p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Student mini-card */}
      <div className="mx-4 mt-4 rounded-xl bg-slate-900/80 border border-slate-800/60 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow">
            {student?.name?.charAt(0) || 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{student?.name}</p>
            <p className={`text-xs font-medium ${levelColors[student?.level] || 'text-slate-400'}`}>
              {student?.level?.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 font-semibold text-violet-400">
            <Zap className="h-3 w-3" /> {student?.xp ?? 0} XP
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-400">
            <Coins className="h-3 w-3" /> {student?.coins ?? 0}
          </span>
          <span className="font-semibold text-orange-400">🔥 {student?.streak ?? 0}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-5">
        {student?.role === 'ROLE_ADMIN' && (
          <div>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
              Administration
            </p>
            <div className="space-y-0.5">
              <NavItem to="/admin" icon={Shield} label="LMS Admin Panel" onClick={onClose} />
            </div>
          </div>
        )}
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, icon, label }) => (
                <NavItem key={to} to={to} icon={icon} label={label} onClick={onClose} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-800/60 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-400 transition hover:bg-rose-900/20 hover:text-rose-300"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 h-full shadow-2xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile topbar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-800/60 bg-slate-950/90 px-4 backdrop-blur lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-violet-400" />
            <span className="font-bold text-white">CareerPilot AI</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Zap className="h-3 w-3 text-violet-400" />
            <span className="font-semibold text-violet-400">{student?.xp ?? 0}</span>
          </div>
        </header>

        <div className="p-6 animate-fade-up">
          {children}
        </div>
      </main>
    </div>
  );
}
