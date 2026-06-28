import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const careerGoals = [
  { value: 'JAVA_DEVELOPER', label: 'Java Developer' },
  { value: 'FULL_STACK_DEVELOPER', label: 'Full Stack Developer' },
  { value: 'DATA_ANALYST', label: 'Data Analyst' },
  { value: 'AI_ENGINEER', label: 'AI Engineer' },
  { value: 'UI_UX_DESIGNER', label: 'UI/UX Designer' },
  { value: 'CLOUD_ENGINEER', label: 'Cloud Engineer' },
];

export default function Profile() {
  const { student, refreshStudent } = useAuth();
  const [form, setForm] = useState({
    name: student?.name || '',
    department: student?.department || '',
    college: student?.college || '',
    year: student?.year || '',
    cgpa: student?.cgpa || '',
    skills: student?.skills?.join(', ') || '',
    careerGoal: student?.careerGoal || '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.put('/students/me', {
        ...form,
        year: form.year ? parseInt(form.year) : null,
        cgpa: form.cgpa ? parseFloat(form.cgpa) : null,
        skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        careerGoal: form.careerGoal,
      });
      await refreshStudent();
      setMessage('Profile updated successfully!');
    } catch {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Student Profile</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {message && (
          <div className={`rounded-lg px-4 py-3 text-sm ${
            message.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {message}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Full Name</label>
            <input name="name" className="input-field" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Department</label>
            <input name="department" className="input-field" value={form.department} onChange={handleChange} />
          </div>
          <div>
            <label className="label">College</label>
            <input name="college" className="input-field" value={form.college} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Year</label>
            <input name="year" type="number" className="input-field" value={form.year} onChange={handleChange} />
          </div>
          <div>
            <label className="label">CGPA</label>
            <input name="cgpa" type="number" step="0.01" className="input-field" value={form.cgpa} onChange={handleChange} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Skills (comma separated)</label>
            <input name="skills" className="input-field" placeholder="Java, SQL, React" value={form.skills} onChange={handleChange} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Career Goal</label>
            <select name="careerGoal" className="input-field" value={form.careerGoal} onChange={handleChange}>
              <option value="">Select goal</option>
              {careerGoals.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-slate-500">Level</p>
              <p className="font-semibold">{student?.level?.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-slate-500">XP</p>
              <p className="font-semibold">{student?.xp}</p>
            </div>
            <div>
              <p className="text-slate-500">Coins</p>
              <p className="font-semibold">{student?.coins}</p>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
