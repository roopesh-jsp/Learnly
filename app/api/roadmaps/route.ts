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
