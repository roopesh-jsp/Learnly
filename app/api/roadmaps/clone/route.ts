import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Roadmap ID is required" },
        { status: 400 }
      );
    }

    // optional: prevent duplicate clones
    const existing = await db.clonedRoadmap.findFirst({
      where: {
        userId,
        roadmapId: id,
      },
    });

    if (existing) {
      return NextResponse.json(existing); // already cloned, just return it
    }

    const clonedRoadmap = await db.clonedRoadmap.create({
      data: {
        userId,
        roadmapId: id,
      },
    });

    return NextResponse.json(clonedRoadmap);
  } catch (error) {
    console.error("Error cloning roadmap:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
