"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Roadmap as PrismaRoadmap,
  Microtask as PrismaMicrotask,
  Task as PrismaTask,
  Prisma,
} from "@prisma/client";

export type RoadmapWithData = Prisma.RoadmapGetPayload<{
  include: {
    microtasks: {
      include: {
        tasks: {
          include: {
            userTasks: true;
          };
        };
      };
    };
  };
}>;

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

export async function getUserRoadMaps(id: string): Promise<PrismaRoadmap[]> {
  try {
    const roadmapData = await db.roadmap.findMany({
      where: {
        ownerId: id,
      },
      include: {
        microtasks: { include: { tasks: true } },
      },
    });
    console.log(roadmapData);

    return roadmapData;
  } catch (error) {
    console.log("Error getting roadmap data:", error);
    return [];
  }
}

export async function getUserRoadMap(
  id: string
): Promise<RoadmapWithData | null> {
  try {
    const user = await auth();
    if (!user?.user?.id) return null;

    const roadmapData = await db.roadmap.findFirst({
      where: {
        id, // roadmap id
        OR: [
          { ownerId: user.user.id }, // case 1: user owns it
          {
            clones: {
              some: { userId: user.user.id }, // case 2: user cloned it
            },
          },
        ],
      },
      include: {
        microtasks: {
          include: {
            tasks: {
              include: {
                userTasks: {
                  where: { userId: user.user.id },
                },
              },
            },
          },
        },
      },
    });

    console.log(roadmapData);
    return roadmapData;
  } catch (error) {
    console.error("Error getting roadmap data:", error);
    return null;
  }
}
