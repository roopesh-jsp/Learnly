import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, microtasks } = body;

    const roadmap = await db.roadmap.create({
      data: {
        title,
        description,
        ownerId: session.user.id,
        microtasks: {
          create: microtasks.map((m: any) => ({
            title: m.title,
            tasks: {
              create: m.tasks.map((t: any) => ({
                title: t.title,
              })),
            },
          })),
        },
      },
      include: {
        microtasks: { include: { tasks: true } },
      },
    });

    return NextResponse.json(roadmap);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, isPublic, id } = body;

    // Make sure roadmap exists and belongs to this user
    const roadmap = await db.roadmap.findUnique({
      where: { id: id },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    if (roadmap.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await db.roadmap.update({
      where: { id: id },
      data: {
        title,
        description,
        isPublic,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to update roadmap" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Roadmap id is required" },
        { status: 400 }
      );
    }

    // Fetch roadmap
    const roadmap = await db.roadmap.findUnique({
      where: { id },
      include: { clones: true },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Check ownership
    if (roadmap.ownerId === session.user.id) {
      // delete its clones
      await db.clonedRoadmap.deleteMany({
        where: { roadmapId: id },
      });
      // Owner: delete roadmap fully
      await db.roadmap.delete({
        where: { id },
      });
      return NextResponse.json({ message: "Roadmap deleted successfully" });
    } else {
      // Cloned: unlink the roadmap from user
      await db.clonedRoadmap.deleteMany({
        where: {
          roadmapId: id,
          userId: session.user.id,
        },
      });
      await db.userTask.deleteMany({
        where: {
          userId: session.user.id,
          task: {
            microtask: {
              roadmapId: id, // only tasks from this roadmap
            },
          },
        },
      });
      return NextResponse.json({
        message: "Cloned roadmap unlinked successfully",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
