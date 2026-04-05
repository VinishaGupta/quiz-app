import { Router } from "express";
import Attempt from "../models/Attempt.js";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/overview", requireAuth, requireAdmin, async (_req, res) => {
  const [users, quizzes, attempts] = await Promise.all([
    User.find().select("name email"),
    Quiz.find().select("title"),
    Attempt.find()
      .populate("user", "name email")
      .populate("quiz", "title")
      .sort({ submittedAt: -1 })
  ]);

  const averageScore = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)
    : 0;

  const topPerformers = users
    .map((user) => {
      const userAttempts = attempts.filter((attempt) => String(attempt.user?._id) === String(user._id));
      const bestScore = userAttempts.length ? Math.max(...userAttempts.map((attempt) => attempt.score)) : 0;
      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        bestScore
      };
    })
    .sort((a, b) => b.bestScore - a.bestScore)
    .slice(0, 5);

  const quizInsights = quizzes.map((quiz) => {
    const quizAttempts = attempts.filter((attempt) => String(attempt.quiz?._id) === String(quiz._id));
    const quizAverage = quizAttempts.length
      ? Math.round(quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length)
      : 0;

    return {
      quizId: quiz._id,
      title: quiz.title,
      attemptCount: quizAttempts.length,
      averageScore: quizAverage
    };
  });

  return res.json({
    metrics: {
      totalUsers: users.length,
      totalQuizzes: quizzes.length,
      totalAttempts: attempts.length,
      averageScore
    },
    topPerformers,
    quizInsights,
    recentAttempts: attempts.slice(0, 10).map((attempt) => ({
      id: attempt._id,
      userName: attempt.user?.name || "Unknown user",
      quizTitle: attempt.quiz?.title || "Untitled quiz",
      score: attempt.score,
      submittedAt: attempt.submittedAt
    }))
  });
});

export default router;

