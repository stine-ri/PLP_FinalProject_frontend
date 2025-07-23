import  { useEffect, useState } from "react";
import axios from "axios";

interface Quiz {
  subject: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Attempt {
  subject: string;
  score: number;
  total: number;
}

const quizBank: Quiz[] = [
  {
    subject: "Math",
    question: "What is 10 + 15?",
    options: ["25", "30", "15", "20"],
    correctAnswer: "25",
  },
  {
    subject: "English",
    question: "Which is a noun?",
    options: ["Run", "Happy", "Book", "Quickly"],
    correctAnswer: "Book",
  },
  {
    subject: "Science",
    question: "Water boils at?",
    options: ["100°C", "0°C", "50°C", "80°C"],
    correctAnswer: "100°C",
  },
];

export default function StudentQuiz() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const res = await axios.get("https://mama-shule.onrender.com/api/quiz/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttempts(res.data);
    } catch (err) {
      console.error("Failed to fetch attempts", err);
    }
  };

  const handleAnswer = (index: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [index]: option }));
  };

  const handleSubmit = async () => {
    let correct = 0;
    quizBank.forEach((quiz, i) => {
      if (answers[i] === quiz.correctAnswer) correct++;
    });

    setScore(correct);
    setSubmitted(true);

    try {
      await axios.post(
        "https://mama-shule.onrender.com/api/quiz/submit",
        {
          score: correct,
          total: quizBank.length,
          subject: "General",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAttempts();
    } catch (err) {
      console.error("Error submitting quiz", err);
    }
  };

  return (
    <div className="bg-white p-6 mt-6 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Student Quiz</h2>

      {quizBank.map((quiz, index) => (
        <div key={index} className="mb-4">
          <p className="font-semibold">
            {index + 1}. ({quiz.subject}) {quiz.question}
          </p>
          {quiz.options.map((option) => (
            <label key={option} className="block ml-4">
              <input
                type="radio"
                name={`q-${index}`}
                value={option}
                checked={answers[index] === option}
                onChange={() => handleAnswer(index, option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-purple-700 text-white px-4 py-2 mt-4 rounded hover:bg-purple-800"
      >
        Submit Quiz
      </button>

      {submitted && (
        <div className="mt-4 text-center text-green-600 font-bold">
          🎉 You scored {score} out of {quizBank.length}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl text-purple-700 font-bold mb-2">Your Previous Attempts</h3>
        <ul className="list-disc ml-5">
          {attempts.map((a, i) => (
            <li key={i}>
              {a.subject}: {a.score} / {a.total}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
