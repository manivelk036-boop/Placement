import { useEffect, useState } from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function CompanyMatch() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students/me/company-matches')
      .then((res) => setMatches(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Company Match Engine</h1>
      <p className="mb-8 text-slate-600">Companies matched to your profile and skills</p>

      <div className="grid gap-4">
        {matches.map((company) => (
          <div key={company.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                  <Building2 className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{company.name}</h3>
                  <p className="text-sm text-slate-500">{company.industry}</p>
                </div>
              </div>
              <div className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                company.matchPercent >= 80
                  ? 'bg-emerald-100 text-emerald-700'
                  : company.matchPercent >= 60
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {company.matchPercent}% Match
              </div>
            </div>

            {company.missingSkills?.length > 0 && (
              <div className="mt-4 rounded-lg bg-amber-50 p-3">
                <p className="mb-2 flex items-center gap-1 text-sm font-medium text-amber-800">
                  <AlertCircle className="h-4 w-4" /> Skill Gaps
                </p>
                <div className="flex flex-wrap gap-2">
                  {company.missingSkills.map((skill) => (
                    <span key={skill} className="rounded bg-white px-2 py-0.5 text-xs text-amber-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
