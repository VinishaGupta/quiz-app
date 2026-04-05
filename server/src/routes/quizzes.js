import { Router } from "express";
import Quiz from "../models/Quiz.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  const quizzes = await Quiz.find({ isPublished: true }).select("-questions.correctOption");
  return res.json({ quizzes });
});

router.get("/:quizId", requireAuth, async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId).select("-questions.correctOption");
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  return res.json({ quiz });
});

export default router;
