import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/quizzes/${quizId}`).then((response) => {
      setQuiz(response.data.quiz);
      setSecondsLeft(response.data.quiz.timeLimitMinutes * 60);
    });
  }, [quizId]);

  useEffect(() => {
    if (!secondsLeft) {
      return undefined;
    }

    const timer = setInterval(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleSubmit = async () => {
    if (submitting || !quiz) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        quizId: quiz._id,
        answers: quiz.questions.map((question) => ({
          questionId: question._id,
          selectedOption: answers[question._id] || ""
        }))
      };
      const response = await api.post("/attempts", payload);
      navigate(`/results/${response.data.attempt._id}`);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (quiz && secondsLeft === 0) {
      handleSubmit();
    }
  }, [secondsLeft, quiz]);

  const attemptedCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers]
  );

  const handleAnswerChange = (questionId, option) => {
    setAnswers((current) => ({ ...current, [questionId]: option }));
  };

  if (!quiz) {
    return <div className="text-slate-600">Loading quiz...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 rounded-[32px] bg-white p-8 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">{quiz.category}</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{quiz.title}</h1>
          <p className="mt-2 text-slate-600">{quiz.description}</p>
        </div>
        <div className="flex gap-4">
          <div className="rounded-3xl bg-slate-900 px-6 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Time left</p>
            <p className="mt-2 text-3xl font-semibold">{formatTime(Math.max(secondsLeft, 0))}</p>
          </div>
          <div className="rounded-3xl bg-brand-100 px-6 py-4 text-brand-900">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-700">Attempted</p>
            <p className="mt-2 text-3xl font-semibold">
              {attemptedCount}/{quiz.questions.length}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        {quiz.questions.map((question, index) => (
          <article key={question._id} className="rounded-[28px] bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Question {index + 1}</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">{question.questionText}</h2>
            <div className="mt-5 grid gap-3">
              {question.options.map((option) => (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                    answers[question._id] === option
                      ? "border-brand-600 bg-brand-50"
                      : "border-slate-200 hover:border-brand-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={question._id}
                    value={option}
                    checked={answers[question._id] === option}
                    onChange={() => handleAnswerChange(question._id, option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </article>
        ))}
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit quiz"}
        </button>
      </div>
    </div>
  );
}

