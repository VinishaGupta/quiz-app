import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function DashboardPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/quizzes"), api.get("/attempts/my")])
      .then(([quizzesResponse, attemptsResponse]) => {
        setQuizzes(quizzesResponse.data.quizzes);
        setAttempts(attemptsResponse.data.attempts);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-[32px] bg-slate-900 p-8 text-white lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Student dashboard</p>
          <h1 className="mt-3 text-4xl font-bold">Ready for your next quiz?</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Start a timed assessment, submit answers safely, and review your complete attempt history.
          </p>
        </div>
        <div className="grid gap-4">
          <div className="rounded-3xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Available quizzes</p>
            <p className="mt-2 text-3xl font-semibold">{quizzes.length}</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Your attempts</p>
            <p className="mt-2 text-3xl font-semibold">{attempts.length}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Available quizzes</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {quizzes.map((quiz) => (
            <article key={quiz._id} className="rounded-[28px] bg-white p-6 shadow-soft">
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-800">
                {quiz.category}
              </span>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">{quiz.title}</h3>
              <p className="mt-2 text-slate-600">{quiz.description}</p>
              <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                <span>{quiz.questions.length} questions</span>
                <span>{quiz.timeLimitMinutes} min</span>
              </div>
              <Link
                to={`/quiz/${quiz._id}`}
                className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-3 font-medium text-white transition hover:bg-brand-800"
              >
                Start quiz
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">Recent results</h2>
        <div className="overflow-hidden rounded-[28px] bg-white shadow-soft">
          <table className="min-w-full">
            <thead className="bg-slate-100 text-left text-sm text-slate-600">
              <tr>
                <th className="px-5 py-4">Quiz</th>
                <th className="px-5 py-4">Score</th>
                <th className="px-5 py-4">Correct</th>
                <th className="px-5 py-4">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt._id} className="border-t border-slate-100">
                  <td className="px-5 py-4">{attempt.quiz?.title || "Quiz"}</td>
                  <td className="px-5 py-4">{attempt.score}%</td>
                  <td className="px-5 py-4">
                    {attempt.correctAnswers}/{attempt.totalQuestions}
                  </td>
                  <td className="px-5 py-4">{new Date(attempt.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
              {attempts.length === 0 && (
                <tr>
                  <td className="px-5 py-6 text-slate-500" colSpan="4">
                    No attempts yet. Start your first quiz above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
