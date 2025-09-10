import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { microtaskId: string } }
) {
  const { title } = await req.json();
  const newTask = await db.task.create({
    data: {
      title,
      microtaskId: params.microtaskId,
    },
  });

  return NextResponse.json(newTask);
}
