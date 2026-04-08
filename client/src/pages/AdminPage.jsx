import { useEffect, useState } from "react";
import api from "../api";

export default function AdminPage() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    api.get("/admin/overview").then((response) => setOverview(response.data));
  }, []);

  if (!overview) {
    return <div className="text-slate-600">Loading admin dashboard...</div>;
  }

  const cards = [
    { label: "Users", value: overview.metrics.totalUsers },
    { label: "Quizzes", value: overview.metrics.totalQuizzes },
    { label: "Attempts", value: overview.metrics.totalAttempts },
    { label: "Average score", value: `${overview.metrics.averageScore}%` }
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-slate-900 p-8 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Admin view</p>
        <h1 className="mt-3 text-4xl font-bold">Results in one place</h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Track attempts, compare scores, and monitor how all users are performing across quizzes.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[28px] bg-white p-6 shadow-soft">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">Top performers</h2>
          <div className="mt-5 space-y-4">
            {overview.topPerformers.map((user) => (
              <div key={user.userId} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <p className="text-lg font-semibold text-brand-700">{user.bestScore}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">Quiz performance</h2>
          <div className="mt-5 space-y-4">
            {overview.quizInsights.map((quiz) => (
              <div key={quiz.quizId} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{quiz.title}</p>
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">
                    {quiz.averageScore}%
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{quiz.attemptCount} attempts</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] bg-white shadow-soft">
        <table className="min-w-full">
          <thead className="bg-slate-100 text-left text-sm text-slate-600">
            <tr>
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Quiz</th>
              <th className="px-5 py-4">Score</th>
              <th className="px-5 py-4">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {overview.recentAttempts.map((attempt) => (
              <tr key={attempt.id} className="border-t border-slate-100">
                <td className="px-5 py-4">{attempt.userName}</td>
                <td className="px-5 py-4">{attempt.quizTitle}</td>
                <td className="px-5 py-4">{attempt.score}%</td>
                <td className="px-5 py-4">{new Date(attempt.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

