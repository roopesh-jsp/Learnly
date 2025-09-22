import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

// 1️⃣ Define schema for QuizProps
const QuizSchema = z.object({
  questions: z.object({
    title: z.string(),
    description: z.string(),
    questions: z.array(
      z.object({
        id: z.string(),
        question: z.string(),
        options: z.array(z.string()),
        correctAnswerIndex: z.number(),
      })
    ),
  }),
});

function extractRoadmapData(data: any) {
  let result = `Roadmap: ${data.title}\n\n`;

  data?.microtasks?.forEach((microtask: any, i: any) => {
    result += `tasks ${i + 1}: ${microtask.title}\n`;

    microtask?.tasks?.forEach((task: any, j: any) => {
      result += `   - subtasks ${j + 1}: ${task.title}\n`;
    });

    result += "\n";
  });

  return result.trim();
}
const parser = StructuredOutputParser.fromZodSchema(QuizSchema);
export async function POST(req: Request) {
  try {
    const { roadmapText, noOfQuestions, difficulity } = await req.json();
    console.log(roadmapText, noOfQuestions, difficulity);

    const roadmapData = extractRoadmapData(roadmapText);

    if (
      !roadmapData ||
      roadmapData.length < 20 ||
      !roadmapData.includes("tasks")
    ) {
      return NextResponse.json(
        { error: "Invalid roadmap data. Cannot generate quiz." },
        { status: 400 }
      );
    }

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are a quiz generator.

I will give you roadmap data, and you must generate a quiz in strict JSON format that follows this schema:

{
  "questions": {
    "title": string, // title of the quiz
    "description": string, // short description of the quiz
    "questions": [
      {
        "id": string, // unique id for the question
        "question": string, // the quiz question
        "options": string[], // multiple choice options
        "correctAnswerIndex": number // index of correct option
      }
    ]
  }
}

Important:
- Only return valid JSON.
- Exactly ${noOfQuestions} questions must be generated.
- The difficulty level of the questions should be "${difficulity}".
- Each question should test knowledge of the roadmap content.
- No extra explanation or text outside JSON.

Roadmap Data:
${roadmapData}
`;

    const res = await model.invoke(prompt);
    let rawContent =
      typeof res.content === "string"
        ? res.content
        : JSON.stringify(res.content);
    // Strip Markdown code fences ```json ... ```
    rawContent = rawContent
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();
    const parsedQuiz = await parser.parse(rawContent);

    console.log("response", parsedQuiz);

    if (
      !parsedQuiz?.questions?.questions ||
      parsedQuiz.questions.questions.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Quiz generation failed. Please provide better roadmap data.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(parsedQuiz);
  } catch (err: any) {
    console.error("Error generating quiz:", err);
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
