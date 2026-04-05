import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: {
      type: [String],
      validate: [(value) => value.length >= 2, "At least two options required"]
    },
    correctOption: { type: String, required: true }
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    timeLimitMinutes: { type: Number, default: 10 },
    questions: [questionSchema],
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);

