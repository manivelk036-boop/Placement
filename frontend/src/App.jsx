import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CareerGoal from './pages/CareerGoal';
import Roadmap from './pages/Roadmap';
import Learning from './pages/Learning';
import Quiz from './pages/Quiz';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import MockInterview from './pages/MockInterview';
import PlacementScore from './pages/PlacementScore';
import CompanyMatch from './pages/CompanyMatch';
import SalaryPredictor from './pages/SalaryPredictor';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';

function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/career-goal" element={<AppLayout><CareerGoal /></AppLayout>} />
          <Route path="/roadmap" element={<AppLayout><Roadmap /></AppLayout>} />
          <Route path="/learning" element={<AppLayout><Learning /></AppLayout>} />
          <Route path="/quiz/:topicId" element={<AppLayout><Quiz /></AppLayout>} />
          <Route path="/resume" element={<AppLayout><ResumeAnalyzer /></AppLayout>} />
          <Route path="/mock-interview" element={<AppLayout><MockInterview /></AppLayout>} />
          <Route path="/placement-score" element={<AppLayout><PlacementScore /></AppLayout>} />
          <Route path="/companies" element={<AppLayout><CompanyMatch /></AppLayout>} />
          <Route path="/salary" element={<AppLayout><SalaryPredictor /></AppLayout>} />
          <Route path="/leaderboard" element={<AppLayout><Leaderboard /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
          <Route path="/admin" element={<AppLayout><AdminPanel /></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
