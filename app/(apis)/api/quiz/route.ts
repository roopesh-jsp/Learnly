import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

// 1️⃣ Define schema for QuizProps
const QuizSchema = z.object({
  questions: z.object({
    roadmapId: z.string(),
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
  timePerQuestion: z.number(),
  numQuestions: z.number(),
});

export async function POST(req: Request) {
  try {
    const { roadmapText } = await req.json();
    console.log("post req made");

    // 2️⃣ Setup Gemini model
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
    });

    // 3️⃣ Setup parser
    const parser = StructuredOutputParser.fromZodSchema(QuizSchema);

    // 4️⃣ Create prompt with format instructions
    const prompt = `
You are a quiz generator AI. Generate a quiz based on the roadmap text below.

Roadmap:
${roadmapText}

Return ONLY valid JSON that matches this schema:
${parser.getFormatInstructions()}

Do not include explanations, markdown, or code fences.
`;

    // 5️⃣ Call Gemini
    const res = await model.invoke(prompt);
    console.log("response", res);

    // 6️⃣ Parse output into structured data
    let outputText = "";
    if (typeof res.content[0] === "string") {
      outputText = res.content[0];
    } else if (Array.isArray(res.content[0])) {
      const textPart = res.content[0].find((c: any) => c.type === "text");
      outputText = textPart?.text || "";
    } else {
      outputText = res.content[0].toString();
    }

    outputText = outputText.replace(/```json|```/g, "").trim();
    const quiz = await parser.parse(outputText);

    console.log("quiz:", quiz);

    return NextResponse.json(quiz);
  } catch (err: any) {
    console.error("Error generating quiz:", err);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
