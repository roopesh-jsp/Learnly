import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Award,
  RotateCcw,
  StepBack,
  ArrowLeft,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";

interface QuizProps {
  questions: {
    roadmapId: string;
    title: string;
    description: string;
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswerIndex: number;
    }[];
  };
  timePerQuestion: number;
  numQuestions: number;
}

interface UserAnswer {
  questionId: string;
  selectedIndex: number | null;
  isCorrect: boolean;
  score: number;
}

const Quiz = ({ questions, timePerQuestion, numQuestions }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const router = useRouter();
  const { myMapId } = useParams() as { myMapId: string };

  // Get limited questions based on numQuestions
  const quizQuestions = questions.questions.slice(0, numQuestions);
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isQuizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      // Auto-submit when time runs out
      handleAnswerSubmit();
    }
  }, [timeLeft, isQuizCompleted]);

  const handleAnswerSubmit = () => {
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    let score = 0;

    if (selectedOption !== null) {
      score = isCorrect ? 5 : -2;
    }

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedOption,
      isCorrect,
      score,
    };

    const newUserAnswers = [...userAnswers, userAnswer];
    setUserAnswers(newUserAnswers);
    setTotalScore((prev) => prev + score);

    // Move to next question or complete quiz
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(timePerQuestion);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setTimeLeft(timePerQuestion);
    setUserAnswers([]);
    setSelectedOption(null);
    setIsQuizCompleted(false);
    setTotalScore(0);
  };

  const getScoreColor = (score: number) => {
    if (score > 0) return "text-green-600";
    if (score < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getScorePercentage = () => {
    const maxPossibleScore = quizQuestions.length * 5;
    const percentage = Math.max(
      0,
      Math.round((totalScore / maxPossibleScore) * 100)
    );
    return percentage;
  };

  // Results UI
  if (isQuizCompleted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center md:p-4 relative bottom-10">
        <div className=" w-full max-w-6xl ">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Quiz Results
            </h1>
            <p className="text-muted-foreground">Here's how you performed!</p>
          </div>

          {/* Score Summary */}
          <div className="bg-muted rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Score</p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(totalScore)}`}
                >
                  {totalScore} points
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Percentage</p>
                <p className="text-2xl font-bold text-foreground">
                  {getScorePercentage()}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="text-2xl font-bold text-foreground">
                  {userAnswers.filter((a) => a.isCorrect).length}/
                  {quizQuestions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Questions Review */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground">
              Question Review
            </h2>
            {quizQuestions.map((question, index) => {
              const userAnswer = userAnswers[index];
              return (
                <div
                  key={question.id}
                  className="bg-secondary/20 rounded-lg p-6 border border-border"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="hidden flex-shrink-0 w-8 h-8 bg-primary rounded-full md:flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        {question.question}
                      </h3>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isCorrect =
                            optionIndex === question.correctAnswerIndex;
                          const isUserSelected =
                            optionIndex === userAnswer.selectedIndex;

                          let className = "p-3 rounded-lg border ";
                          if (isCorrect) {
                            className +=
                              "bg-green-100 border-green-300 text-green-800";
                          } else if (isUserSelected && !isCorrect) {
                            className +=
                              "bg-red-100 border-red-300 text-red-800";
                          } else {
                            className +=
                              "bg-background border-border text-muted-foreground";
                          }

                          return (
                            <div key={optionIndex} className={className}>
                              <div className="flex items-center gap-2">
                                {isCorrect && (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                {isUserSelected && !isCorrect && (
                                  <XCircle className="w-4 h-4" />
                                )}
                                <span>{option}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <span
                          className={`font-semibold ${getScoreColor(
                            userAnswer.score
                          )}`}
                        >
                          Score: {userAnswer.score > 0 ? "+" : ""}
                          {userAnswer.score}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Your answer:{" "}
                          {userAnswer.selectedIndex !== null
                            ? question.options[userAnswer.selectedIndex]
                            : "Not answered"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Restart Button */}
          <div className="text-center flex items-center gap-3 w-fit mx-auto">
            <button
              onClick={restartQuiz}
              className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Restart Quiz
            </button>
            <button
              onClick={() => {
                router.push(`/my-learning/${myMapId}`);
              }}
              className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz UI
  return (
    <div className="min-h-screen w-full  flex items-center justify-center md:p-4 relative bottom-10 md:bottom-20">
      <div className="bg-background rounded-2xl shadow-2xl p-8 w-full max-w-4xl border border-border">
        {/* Header with progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-md md:text-lg xl:text-xl font-semibold text-foreground">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Current Score: {totalScore} points
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-primary">
                <Clock className="w-5 h-5" />
                <span className="text-lg md:text-xl xl:text-2xl font-bold">
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / quizQuestions.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h1 className="text-lg md:text-xl xl:text-2xl font-bold text-foreground mb-6">
            {currentQuestion.question}
          </h1>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedOption === index
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === index
                        ? "border-primary-foreground bg-primary-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedOption === index && (
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                    )}
                  </div>
                  <span className="font-medium text-sm md:text-md xl:text-xl">
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <div className="text-center">
          <div className="flex items-center flex-col md:flex-row gap-3 mx-auto w-fit">
            <button
              onClick={handleAnswerSubmit}
              disabled={selectedOption === null}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                selectedOption !== null
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {currentQuestionIndex + 1 === quizQuestions.length
                ? "Finish Quiz"
                : "Next Question"}
            </button>
            <button
              onClick={handleAnswerSubmit}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${"bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"}`}
            >
              {currentQuestionIndex + 1 === quizQuestions.length
                ? "skip & Finish"
                : "skip"}
            </button>
          </div>

          <p className="text-sm text-muted-foreground mt-3">
            {selectedOption === null
              ? "Select an answer"
              : "Click to submit your answer"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
