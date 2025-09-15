"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ShimmerLoader from "@/components/custom/Shimer";
import { useSession } from "next-auth/react";

import {
  checkIsCloned,
  getRoadmapDataWithId,
  RoadmapWithData,
} from "@/services/roadmaps";
import { Save, User } from "lucide-react";

type RoadmapExtended = RoadmapWithData & {
  owner?: {
    id: string;
    name: string | null;
  };
  _count?: {
    clones: number;
  };
};

const RoadMap = () => {
  const { roadmapId } = useParams() as { roadmapId: string };
  const [roadMap, setRoadmap] = useState<RoadmapExtended>();
  const [isCloned, setIsCloned] = useState(false);
  const router = useRouter();
  const session = useSession();

  const handleClone = async () => {
    try {
      await fetch(`/api/roadmaps/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roadmapId }),
      });
      router.push("/my-learning");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getRoadmapDataWithId(roadmapId);
      const isClonedRes = await checkIsCloned(roadmapId);
      setIsCloned(isClonedRes);
      if (data) setRoadmap(data);
    })();
  }, []);

  if (!roadMap)
    return (
      <div className="p-6 text-center">
        <ShimmerLoader />
      </div>
    );

  return (
    <div className="w-full min-h-screen p-6 ">
      <Card className="w-full max-w-4xl mx-auto mt-5 rounded-2xl shadow-lg bg-gradient-to-b from-primary/5 via-background to-background border-none">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-[var(--primary)]">
            {roadMap.title}
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            {roadMap.description}
          </CardDescription>

          <div className="flex justify-center gap-6 mt-3 text-sm text-gray-500">
            <span className="flex gap-2 items-center">
              <User className="w-4 h-4 text-[var(--primary)]" />
              Owner: {roadMap.owner?.name ?? "Unknown"}
            </span>
            <span className="flex gap-2 items-center">
              <Save className="w-4 h-4 text-amber-600" />
              Clones: {roadMap._count?.clones ?? 0} users
            </span>
          </div>
        </CardHeader>

        <CardContent className="mt-6 space-y-4">
          <Accordion type="single" collapsible className="space-y-3">
            {roadMap.microtasks.map((microtask) => (
              <AccordionItem
                key={microtask.id}
                value={microtask.id}
                className="rounded-xl border border-primary/20 bg-white/30 backdrop-blur-md shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="font-semibold text-lg text-[var(--primary)] px-4 py-3 hover:bg-[var(--primary)]/10 transition">
                  {microtask.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2 px-6 py-3">
                    {microtask.tasks.map((task) => (
                      <li
                        key={task.id}
                        className="text-sm text-gray-700 leading-relaxed hover:text-[var(--primary)] transition"
                      >
                        {task.title}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex justify-center w-full mt-10">
            {isCloned || session.data?.user?.id === roadMap.ownerId ? (
              <Button
                className="px-6 py-3 text-md bg-secondary text-primary font-medium rounded-md cursor-pointer shadow-md hover:shadow-lg hover:bg-stone-200 transition"
                onClick={() => router.push(`/my-learning/${roadmapId}`)}
              >
                Go to learning
              </Button>
            ) : (
              <Button
                className="px-6 py-3 text-md bg-primary text-secondary font-medium rounded-md cursor-pointer shadow-md hover:shadow-lg hover:bg-stone-200 transition"
                onClick={handleClone}
              >
                Clone
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadMap;
