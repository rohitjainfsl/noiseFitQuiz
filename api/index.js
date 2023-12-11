import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors({ origin: "http://127.0.0.1:5500" }));

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/quizNoiseFit")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

// Define the schema

// Define the schema
const quizSchema = new mongoose.Schema({
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          type: String,
          required: true,
        },
      ],
      correctAnswer: {
        type: String,
        required: true,
      },
    },
  ],
});

// Create a model based on the schema
const Quiz = mongoose.model("Quiz", quizSchema);

// Create a quiz
app.post("/api/quizzes", async (req, res) => {
  const quiz = new Quiz({
    questions: req.body.questions,
  });

  try {
    await quiz.save();
    res.send(quiz);
  } catch (error) {
    console.log(error);
  }
});

// Get all quizzes
app.get("/api/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    console.log(quizzes)
    res.send(quizzes);
  } catch (error) {
    console.log(error);
  }
});

// Get a single quiz
app.get("/api/quizzes/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.send(quiz);
  } catch (error) {
    console.log(error);
  }
});

// Update a quiz
app.put("/api/quizzes/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    quiz.questions = req.body.questions;
    await quiz.save();
    res.send(quiz);
  } catch (error) {
    console.log(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
