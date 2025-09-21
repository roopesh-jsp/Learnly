"use client";
import { getRoadmapDataWithId, RoadmapWithData } from "@/services/roadmaps";
import { Roadmap } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Play, Clock, Target, BookOpen, AlertCircle } from "lucide-react";
import Quiz from "./components/Quiz";
export const roadmapQuiz = {
  roadmapId: "48095c5a-07ea-4764-83ce-d58806699258",
  title: "Full Stack Developer Roadmap Quiz",
  description: "Test your knowledge of the Full Stack Developer Roadmap.",
  questions: [
    {
      id: "q1",
      question: "Which frontend framework is mentioned in the roadmap?",
      options: ["Angular", "React or Vue", "Svelte", "Ember"],
      correctAnswerIndex: 1,
    },
    {
      id: "q2",
      question: "Which library is suggested for state management in frontend?",
      options: ["MobX", "Redux/Pinia", "Zustand", "Apollo"],
      correctAnswerIndex: 1,
    },
    {
      id: "q3",
      question: "Which tool is recommended for building a REST API?",
      options: ["Spring Boot", "Express", "Django", "Flask"],
      correctAnswerIndex: 1,
    },
    {
      id: "q4",
      question: "Which authentication method is listed in the roadmap?",
      options: ["OAuth2", "Session-based", "JWT", "API Keys"],
      correctAnswerIndex: 2,
    },
    {
      id: "q5",
      question: "Which database skill is included in the roadmap?",
      options: [
        "Graph Databases",
        "SQL Fundamentals",
        "NoSQL Basics",
        "Firebase",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "q6",
      question: "Which ORM-related topic is mentioned?",
      options: [
        "Entity Framework",
        "Hibernate",
        "Advanced Prisma Queries",
        "Sequelize Basics",
      ],
      correctAnswerIndex: 2,
    },
    {
      id: "q7",
      question: "Which deployment tool is listed?",
      options: ["Heroku", "Docker Basics", "Kubernetes", "Railway"],
      correctAnswerIndex: 1,
    },
    {
      id: "q8",
      question: "Which CI/CD tool category is part of the roadmap?",
      options: [
        "Monitoring Tools",
        "CI/CD Pipelines",
        "Testing Frameworks",
        "Logging Tools",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "q9",
      question: "Where can you deploy applications according to the roadmap?",
      options: ["Vercel/AWS", "DigitalOcean", "Heroku", "Netlify"],
      correctAnswerIndex: 0,
    },
  ],
};
const QuizPage = () => {
  const { myMapId } = useParams() as { myMapId: string };
  const [roadmap, setRoadmap] = useState<RoadmapWithData | null>(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [difficulty, setDifficulty] = useState("medium");
  const [startQuiz, setStartQuiz] = useState(false);

  const handleStartQuiz = () => {
    console.log("Starting quiz with:", {
      numQuestions,
      timePerQuestion,
      difficulty,
    });
    // Quiz start logic would go here

    setStartQuiz(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRoadmapDataWithId(myMapId);
      if (data) setRoadmap(data);
    };
    fetchData();
  }, [myMapId]);
  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto flex items-center justify-center p-4">
      {startQuiz ? (
        <Quiz
          questions={roadmapQuiz}
          timePerQuestion={timePerQuestion}
          numQuestions={numQuestions}
        />
      ) : (
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-stone-300 mb-2">
              Quiz Challenge
            </h1>
            <p className="text-gray-600 dark:text-stone-400">
              Configure your quiz settings and test your knowledge!
            </p>
          </div>

          {/* Configuration Options */}
          <div className="mb-8 flex items-start justify-center gap-10 xl:gap-20 flex-wrap">
            {/* Number of Questions */}
            <div className=" flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <label className="text-lg font-semibold text-gray-800 dark:text-stone-300">
                  Number of Questions: {numQuestions}
                </label>
              </div>
              <div className="flex gap-2">
                {[5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNumQuestions(num)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      numQuestions === num
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Time per Question */}
            <div className=" flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                <label className="text-lg font-semibold text-gray-800 dark:text-stone-300">
                  Time per Question: {timePerQuestion}s
                </label>
              </div>
              <div className="flex gap-5">
                {[10, 20, 30].map((time) => (
                  <button
                    key={time}
                    onClick={() => setTimePerQuestion(time)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      timePerQuestion === time
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {time}s
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className=" flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <label className="text-lg font-semibold text-gray-800 dark:text-stone-300">
                  Difficulty Level:{" "}
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </label>
              </div>
              <div className="flex gap-5">
                {["easy", "medium", "hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      difficulty === level
                        ? level === "easy"
                          ? "bg-green-600 text-white shadow-md"
                          : level === "medium"
                          ? "bg-yellow-600 text-white shadow-md"
                          : "bg-red-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start Quiz Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleStartQuiz}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
            >
              <Play className="w-6 h-6" />
              Start Quiz
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  Important Instructions
                </h3>
                <p className="text-amber-700 leading-relaxed">
                  Please do not refresh the page once you start the quiz until
                  you complete and submit it. Refreshing will reset your
                  progress and you'll need to start over.
                </p>
              </div>
            </div>
          </div>

          {/* Quiz Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2">Quiz Summary:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• {numQuestions} questions to answer</p>
              <p>• {timePerQuestion} seconds per question</p>
              <p>
                • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}{" "}
                difficulty level
              </p>
              <p>
                • Total estimated time:{" "}
                {Math.ceil((numQuestions * timePerQuestion) / 60)} minutes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
