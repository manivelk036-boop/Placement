import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

export default function Quiz() {
  const { topicId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/learning/topics/${topicId}/quiz`)
      .then((res) => setQuiz(res.data.data))
      .finally(() => setLoading(false));
  }, [topicId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.post(`/learning/quizzes/${quiz.id}/submit`, answers);
      setResult(res.data.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (result) {
    const passed = result.score >= quiz.passingScore;
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="card">
          {passed ? (
            <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
          ) : (
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
          )}
          <h1 className="mt-4 text-2xl font-bold">{passed ? 'Quiz Passed!' : 'Keep Practicing'}</h1>
          <p className="mt-2 text-4xl font-bold text-primary-600">{result.score}%</p>
          <p className="mt-1 text-slate-600">Proficiency: {result.proficiencyLevel}</p>
          {passed && <p className="mt-2 text-sm text-emerald-600">+50 XP · +50 Coins earned!</p>}
          <Link to="/learning" className="btn-primary mt-6 inline-flex">Back to Learning</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">{quiz?.title}</h1>
      <p className="mb-8 text-slate-600">Passing score: {quiz?.passingScore}%</p>

      <div className="space-y-6">
        {quiz?.questions?.map((q, idx) => {
          const options = q.options?.split('|') || [];
          return (
            <div key={q.id} className="card">
              <p className="mb-4 font-medium text-slate-900">
                {idx + 1}. {q.questionText}
              </p>
              <div className="space-y-2">
                {options.map((opt) => (
                  <label
                    key={opt}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                      answers[q.id] === opt
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                      className="text-primary-600"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || Object.keys(answers).length < quiz?.questions?.length}
        className="btn-primary mt-8 w-full"
      >
        {submitting ? 'Submitting...' : 'Submit Quiz'}
      </button>
    </div>
  );
}
