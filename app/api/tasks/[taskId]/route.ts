import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// DELETE /api/tasks/:taskId
export async function DELETE(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = params.taskId;

    // Check ownership
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: { microtask: { include: { roadmap: true } } },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.microtask.roadmap.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete task error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
