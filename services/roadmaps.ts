"use server";
import { db } from "@/lib/db";
import {
  Roadmap as PrismaRoadmap,
  Microtask as PrismaMicrotask,
  Task as PrismaTask,
} from "@prisma/client";

export async function getRoadmapsData() {
  try {
    const roadmapData = await db.roadmap.findMany({
      where: {
        isPublic: true,
      },
      include: {
        microtasks: {
          include: {
            tasks: true,
          },
        },
      },
    });
    return roadmapData;
  } catch (error) {
    console.log("Error getting roadmap data:", error);
  }
}

// No need for custom Roadmap/Microtask/Task types

export async function getRoadmapDataWithId(id: string): Promise<
  | (PrismaRoadmap & {
      microtasks: (PrismaMicrotask & { tasks: PrismaTask[] })[];
    })
  | null
> {
  try {
    const roadmapData = await db.roadmap.findFirst({
      where: {
        id,
        isPublic: true,
      },
      include: {
        microtasks: { include: { tasks: true } },
      },
    });
    console.log(roadmapData);

    return roadmapData;
  } catch (error) {
    console.log("Error getting roadmap data:", error);
    return null;
  }
}
