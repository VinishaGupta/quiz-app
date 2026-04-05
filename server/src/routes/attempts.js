import { Router } from "express";
import Attempt from "../models/Attempt.js";
import Quiz from "../models/Quiz.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/my", requireAuth, async (req, res) => {
  const attempts = await Attempt.find({ user: req.user._id })
    .populate("quiz", "title")
    .sort({ submittedAt: -1 });

  return res.json({ attempts });
});

router.post("/", requireAuth, async (req, res) => {
  const { quizId, answers = [] } = req.body;
  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  const normalizedAnswers = quiz.questions.map((question) => {
    const submittedAnswer = answers.find(
      (answer) => String(answer.questionId) === String(question._id)
    );
    const selectedOption = submittedAnswer?.selectedOption || "";

    return {
      questionId: question._id,
      selectedOption,
      isCorrect: selectedOption === question.correctOption
    };
  });

  const correctAnswers = normalizedAnswers.filter((answer) => answer.isCorrect).length;
  const totalQuestions = quiz.questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  const attempt = await Attempt.create({
    user: req.user._id,
    quiz: quiz._id,
    answers: normalizedAnswers,
    totalQuestions,
    correctAnswers,
    score,
    submittedAt: new Date()
  });

  return res.status(201).json({ attempt });
});

export default router;

