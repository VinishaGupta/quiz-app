import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDatabase } from "./config/db.js";
import Attempt from "./models/Attempt.js";
import Quiz from "./models/Quiz.js";
import User from "./models/User.js";

dotenv.config();

async function seed() {
  await connectDatabase();

  await Promise.all([Attempt.deleteMany({}), Quiz.deleteMany({}), User.deleteMany({})]);

  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
  const studentPasswordHash = await bcrypt.hash("Student@123", 10);

  const [adminUser, studentUser] = await User.create([
    {
      name: "Quiz Admin",
      email: "admin@quizmaster.com",
      passwordHash: adminPasswordHash,
      role: "admin"
    },
    {
      name: "Sample Student",
      email: "student@quizmaster.com",
      passwordHash: studentPasswordHash,
      role: "user"
    }
  ]);

  const quiz = await Quiz.create({
    title: "Web Development Fundamentals",
    description: "A starter quiz covering HTML, CSS, JavaScript, and backend basics.",
    category: "Development",
    timeLimitMinutes: 12,
    questions: [
      {
        questionText: "Which library is commonly used for building user interfaces in this project?",
        options: ["Angular", "React", "Vue", "Svelte"],
        correctOption: "React"
      },
      {
        questionText: "What does JWT usually stand for?",
        options: ["Java Web Token", "JSON Web Token", "JavaScript Web Transfer", "Joined Web Ticket"],
        correctOption: "JSON Web Token"
      },
      {
        questionText: "Which database is being used in this project stack?",
        options: ["PostgreSQL", "MongoDB", "SQLite", "Oracle"],
        correctOption: "MongoDB"
      },
      {
        questionText: "Which package is used to hash passwords on the backend?",
        options: ["bcryptjs", "multer", "socket.io", "nodemailer"],
        correctOption: "bcryptjs"
      },
      {
        questionText: "Which backend framework is used here?",
        options: ["Fastify", "NestJS", "Express", "Hapi"],
        correctOption: "Express"
      }
    ]
  });

  await Attempt.create({
    user: studentUser._id,
    quiz: quiz._id,
    answers: quiz.questions.map((question, index) => ({
      questionId: question._id,
      selectedOption: index < 4 ? question.correctOption : "Fastify",
      isCorrect: index < 4
    })),
    totalQuestions: 5,
    correctAnswers: 4,
    score: 80,
    submittedAt: new Date()
  });

  console.log("Seed completed");
  console.log(`Admin login: ${adminUser.email} / Admin@123`);
  console.log(`User login: ${studentUser.email} / Student@123`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
