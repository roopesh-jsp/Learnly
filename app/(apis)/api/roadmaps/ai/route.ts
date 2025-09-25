import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { NextResponse } from "next/server";
import { string, z } from "zod";

const RoadMap = z.object({
  title: z.string(),
  description: z.string(),
  microtasks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      tasks: z.array(z.object({ id: z.string(), title: z.string() })),
    })
  ),
});

const parser = StructuredOutputParser.fromZodSchema(RoadMap);

export async function POST(req: Request) {
  const { prompt } = await req.json();
  if (
    prompt.length < 50 ||
    prompt.trim().split(/\s+/).filter(Boolean).length < 10
  ) {
    return NextResponse.json(
      {
        error: "Need alteast 50 characters and 10 words ",
      },
      {
        status: 500,
      }
    );
  }

  const us = await auth();
  if (!us) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await db.user.findUnique({
    where: { id: us?.user?.id },
  });
  console.log(user);

  if (!user || user.credits <= 0) {
    return NextResponse.json(
      { error: "Insufficient credits" },
      { status: 403 }
    );
  }
  try {
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
    });
    const fullPrompt = `
You are an assistant that generates structured roadmaps.

The user will provide some context or requirements in the prompt:
"${prompt}"

Based on this input, create a roadmap object in **valid JSON** format that strictly follows this schema:

{
  "title": string,                // A clear title for the roadmap
  "description": string,          // A concise description
  "microtasks": [
    {
      "id": string,               // unique identifier (can be a UUID or any random string)
      "title": string,            // short title for the microtask
      "tasks": [
        {
          "id": string,           // unique identifier (UUID or random string)
          "title": string         // short title for the task
        }
      ]
    }
  ]
}

⚠️ IMPORTANT RULES:
- Output must be ONLY valid JSON (no Markdown formatting, no explanation, no comments).
- Make sure all id fields are strings (e.g., "t1", "m1", "uuid-123").
- Do not include extra fields outside the schema.
- Avoid trailing commas.
- Keep titles concise but descriptive.

Return the JSON directly.
`;

    const res = await model.invoke(fullPrompt);
    let rawContent =
      typeof res.content === "string"
        ? res.content
        : JSON.stringify(res.content);
    // Strip Markdown code fences ```json ... ```
    rawContent = rawContent
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();
    const generatedRoadMap = await parser.parse(rawContent);
    console.log(generatedRoadMap);
    await db.user.update({
      where: { id: us?.user?.id },
      data: { credits: { decrement: 1 } },
    });
    return NextResponse.json(generatedRoadMap);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "error on generating roadmap",
      },
      {
        status: 500,
      }
    );
  }
}
