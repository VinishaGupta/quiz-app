import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

export default function ResultPage() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    api.get("/attempts/my").then((response) => {
      const match = response.data.attempts.find((item) => item._id === attemptId);
      setAttempt(match || null);
    });
  }, [attemptId]);

  if (!attempt) {
    return <div className="text-slate-600">Loading result...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-10 shadow-soft">
      <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Result summary</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-900">{attempt.quiz?.title}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-brand-50 p-6">
          <p className="text-sm text-brand-700">Score</p>
          <p className="mt-2 text-4xl font-bold text-brand-900">{attempt.score}%</p>
        </div>
        <div className="rounded-3xl bg-slate-100 p-6">
          <p className="text-sm text-slate-500">Correct answers</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">
            {attempt.correctAnswers}/{attempt.totalQuestions}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6 text-white">
          <p className="text-sm text-slate-300">Submitted at</p>
          <p className="mt-2 text-lg font-semibold">
            {new Date(attempt.submittedAt).toLocaleString()}
          </p>
        </div>
      </div>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-brand-700 px-5 py-3 font-medium text-white transition hover:bg-brand-800"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

