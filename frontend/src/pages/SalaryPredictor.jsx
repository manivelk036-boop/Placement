import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import api from '../services/api';

export default function SalaryPredictor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/salary-predictor')
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const formatSalary = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Salary Predictor</h1>
      <p className="mb-8 text-slate-600">
        Estimated salary potential based on your skills and progress
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <div className="mb-4 inline-flex rounded-lg bg-primary-50 p-2.5">
            <DollarSign className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-sm font-medium text-slate-500">Current Potential</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatSalary(data?.currentPotential)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Based on current skills &amp; score</p>
        </div>

        <div className="card">
          <div className="mb-4 inline-flex rounded-lg bg-emerald-50 p-2.5">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-sm font-medium text-slate-500">Future Potential</h3>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {formatSalary(data?.futurePotential)}
          </p>
          <p className="mt-1 text-xs text-slate-500">After completing roadmap</p>
        </div>
      </div>

      <div className="mt-6 card">
        <h3 className="mb-3 font-semibold">How to increase your salary potential</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>• Complete all topics in your career roadmap</li>
          <li>• Add internships and certifications to your profile</li>
          <li>• Improve mock interview scores above 80%</li>
          <li>• Build and showcase portfolio projects</li>
        </ul>
      </div>
    </div>
  );
}
