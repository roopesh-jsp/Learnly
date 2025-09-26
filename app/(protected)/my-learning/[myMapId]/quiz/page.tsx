"use client";
import { getRoadmapDataWithId, RoadmapWithData } from "@/services/roadmaps";
import { Roadmap } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Play,
  Clock,
  Target,
  BookOpen,
  AlertCircle,
  StepBack,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Quiz from "./components/Quiz";
export const roadmapQuizz = {
  title: "Frontend Developer Mastery Challenge",
  description:
    "A challenging quiz to test your advanced knowledge across HTML, CSS, and JavaScript fundamentals, as outlined in the Frontend Developer Roadmap.",
  questions: [
    {
      id: "html-q1",
      question:
        "Which HTML5 element, though deprecated in HTML 4.01, saw a revival in HTML5 as a semantic way to represent marked or highlighted text for reference or notation purposes, without implying importance?",
      options: ["<em>", "<mark>", "<ins>", "<strong>"],
      correctAnswerIndex: 1,
    },
    {
      id: "html-q2",
      question:
        "When using the `autocomplete` attribute on an `input` element, which value will disable the browser’s ability to automatically complete the input, even if it normally would?",
      options: ["off", "false", "disable", "none"],
      correctAnswerIndex: 0,
    },
    {
      id: "css-q1",
      question:
        "Consider the CSS selector `article:has(> header + p)`. Which of the following best describes what this selector targets?",
      options: [
        "Any `article` element containing a `header` immediately followed by any sibling",
        "Any `article` element containing a `header` immediately followed by a `p`",
        "Any `article` with both a `header` and at least one `p` inside",
        "All `p` elements inside `article` with a `header` sibling",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "css-q2",
      question:
        "In a flex container with `flex-flow: row wrap;` and no explicit `flex` values, how does `flex-shrink` *by default* affect the items on that line?",
      options: [
        "All items shrink equally to fit into the line",
        "Items don’t shrink unless `flex-shrink` is set",
        "Only the last item shrinks to make space",
        "Items expand instead of shrinking",
      ],
      correctAnswerIndex: 0,
    },
    {
      id: "css-q3",
      question:
        "When defining a CSS Grid layout, how does `grid-auto-flow: dense;` work together with `grid-template-areas` to fill sparse areas?",
      options: [
        "It prevents items from being placed in unassigned areas",
        "It backfills gaps with smaller items to reduce empty space",
        "It forces all items into explicitly named areas only",
        "It ignores `grid-template-areas` and auto-places freely",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "js-q1",
      question:
        "Consider the JavaScript code: `const func = (x) => () => x++; const closure1 = func(5); const closure2 = func(5); console.log(closure1(), closure2());`. What values will be logged, and why?",
      options: [
        "`5 5` — each closure has its own independent `x`",
        "`5 6` — closures share `x` and increment together",
        "`6 6` — both closures increment before logging",
        "`6 7` — `x` persists across closures",
      ],
      correctAnswerIndex: 0,
    },
    {
      id: "js-q2",
      question:
        "In JavaScript's strict mode, what is the behavior of `this` when used in a function that is not a method, constructor, or part of `call`/`apply`/`bind`?",
      options: [
        "`this` refers to the global object",
        "`this` is `undefined`",
        "`this` refers to the window object",
        "`this` refers to the function itself",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "js-q3",
      question:
        "Which of the following JavaScript DOM methods is most efficient for inserting multiple nodes in a single operation, minimizing reflows and repaints?",
      options: [
        "appendChild",
        "innerHTML",
        "insertAdjacentHTML",
        "DocumentFragment",
      ],
      correctAnswerIndex: 3,
    },
    {
      id: "js-q4",
      question:
        "What is a key distinction regarding `this` binding in arrow functions compared to regular functions, especially when they are defined within an object's method?",
      options: [
        "Arrow functions automatically bind to the object",
        "Arrow functions inherit `this` from the enclosing scope",
        "Arrow functions default `this` to global",
        "Arrow functions can’t access `this` at all",
      ],
      correctAnswerIndex: 1,
    },
    {
      id: "js-q5",
      question:
        "When creating custom elements using the Web Components API, which lifecycle callback is called when the element is inserted into the DOM, often used for setting up event listeners or rendering initial content?",
      options: [
        "connectedCallback",
        "disconnectedCallback",
        "adoptedCallback",
        "attributeChangedCallback",
      ],
      correctAnswerIndex: 0,
    },
  ],
};

export interface QuizData {
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
  }[];
}
const QuizPage = () => {
  const { myMapId } = useParams() as { myMapId: string };
  const [roadmap, setRoadmap] = useState<RoadmapWithData | null>(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [difficulty, setDifficulty] = useState("medium");
  const [startQuiz, setStartQuiz] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmapQuiz, setRoadmapQuiz] = useState<QuizData | null>(null);
  const router = useRouter();

  const handleStartQuiz = async () => {
    console.log("Starting quiz with:", { numQuestions, difficulty });
    setStartQuiz(true);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roadmapText: roadmap,
          noOfQuestions: numQuestions,
          difficulity: difficulty, // spelling matches backend
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to start quiz");
      }

      const data = await res.json();
      console.log(data);

      setRoadmapQuiz(data.questions);
      setStartQuiz(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await getRoadmapDataWithId(myMapId);
      if (data) setRoadmap(data);
    };
    fetchData();
  }, [myMapId]);
  return (
    <div className="min-h-screen w-full  max-w-7xl mx-auto flex items-center justify-center md:p-4">
      {loading ? (
        // LOADER UI
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-lg font-medium text-gray-700 dark:text-stone-300">
            Wait while preparing your quiz using AI. <br />
            <span className="text-red-500 font-semibold">
              Don’t refresh the page till the end!
            </span>
          </p>
        </div>
      ) : error ? (
        // ERROR MESSAGE
        <div className="flex flex-col items-center justify-center text-center p-6 bg-red-50 border border-red-200 rounded-xl max-w-md">
          <AlertCircle className="w-10 h-10 text-red-600 mb-2" />
          <h2 className="text-lg font-semibold text-red-700 mb-1">
            Something went wrong
          </h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={handleStartQuiz}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : startQuiz && roadmapQuiz ? (
        <Quiz
          questions={roadmapQuiz}
          timePerQuestion={timePerQuestion}
          numQuestions={numQuestions}
        />
      ) : (
        <div className="w-full max-w-2xl">
          {/* Header */}
          <button
            onClick={() => {
              router.push(`/my-learning/${myMapId}`);
            }}
            className=" absolute cursor-pointer top-5 left-5 md:top-10 md:left-10 inline-flex items-center gap-2  px-3 py-2 md:px-6 md:py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
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
          <div className="my-14 flex items-start justify-center gap-12 xl:gap-20 flex-wrap">
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
