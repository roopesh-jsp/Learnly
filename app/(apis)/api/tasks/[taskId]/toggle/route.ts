import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await db.userTask.findUnique({
    where: {
      userId_taskId: {
        userId: session.user.id,
        taskId: params.taskId,
      },
    },
  });

  let updated;
  if (existing) {
    updated = await db.userTask.update({
      where: { id: existing.id },
      data: { done: !existing.done },
    });
  } else {
    updated = await db.userTask.create({
      data: { userId: session.user.id, taskId: params.taskId, done: true },
    });
  }

  return NextResponse.json(updated);
}
