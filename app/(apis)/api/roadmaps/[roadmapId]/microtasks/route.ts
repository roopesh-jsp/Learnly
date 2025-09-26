import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ roadmapId: string }> }
) {
  try {
    const user = await auth();
    if (!user?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { roadmapId } = await params;
    const { title } = await req.json();
    if (!title?.trim()) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const microtask = await db.microtask.create({
      data: {
        title,
        roadmapId,
      },
    });

    return NextResponse.json(microtask);
  } catch (error) {
    console.error("Error creating microtask:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
