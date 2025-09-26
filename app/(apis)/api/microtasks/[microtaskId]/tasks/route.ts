import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ microtaskId: string }> }
) {
  const { title } = await req.json();
  const { microtaskId } = await params;
  const newTask = await db.task.create({
    data: {
      title,
      microtaskId,
    },
  });

  return NextResponse.json(newTask);
}
