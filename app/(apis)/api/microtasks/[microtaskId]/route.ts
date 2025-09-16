import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// DELETE /api/microtasks/:microtaskId
export async function DELETE(
  req: Request,
  { params }: { params: { microtaskId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const microtaskId = params.microtaskId;

    // Check ownership
    const micro = await db.microtask.findUnique({
      where: { id: microtaskId },
      include: { roadmap: true },
    });

    if (!micro) {
      return NextResponse.json(
        { error: "Microtask not found" },
        { status: 404 }
      );
    }

    if (micro.roadmap.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.microtask.delete({
      where: { id: microtaskId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete microtask error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
