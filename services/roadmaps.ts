"use server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Roadmap as PrismaRoadmap, Prisma, Roadmap } from "@prisma/client";

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
        owner: true,
        _count: {
          select: { clones: true }, // gives you the number of clones
        },
      },
    });

    return roadmapData;
  } catch (error) {
    console.log("Error getting roadmap data:", error);
  }
}

export async function getRoadmapDataWithId(
  id: string
): Promise<RoadmapWithData | null> {
  try {
    const roadmap = await db.roadmap.findUnique({
      where: { id },
      include: {
        microtasks: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!roadmap) return null;

    return roadmap;
  } catch (error) {
    console.log("Error getting roadmap data:", error);
    return null;
  }
}

export async function getUserRoadMaps(id: string): Promise<any[]> {
  try {
    const userData = await db.user.findUnique({
      where: { id },
      include: {
        roadmaps: true, // roadmaps the user owns
        cloned: {
          include: {
            roadmap: true, // if ClonedRoadmap has relation to Roadmap
          },
        },
      },
    });

    if (!userData) return [];

    // Combine owned + cloned into one array if you want a single list
    const allRoadmaps = [
      ...userData.roadmaps,
      ...userData.cloned.map((c) => ({
        ...c.roadmap,
        isCloned: true,
        clonedId: c.id,
      })),
    ];

    return allRoadmaps;
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
