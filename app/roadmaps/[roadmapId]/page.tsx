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
import { Separator } from "@/components/ui/separator";

import {
  checkIsCloned,
  getRoadmapDataWithId,
  RoadmapWithData,
} from "@/services/roadmaps";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ShimmerLoader from "@/components/custom/Shimer";
import { useSession } from "next-auth/react";

const RoadMap = () => {
  const { roadmapId } = useParams() as { roadmapId: string };
  // const roadmapId = (await params).roadmapId;
  const [roadMap, setRoadmap] = useState<RoadmapWithData | null>(null);
  const [isCloned, setIsCloned] = useState(false);
  const router = useRouter();
  const sesssion = useSession();

  const handleClone = async () => {
    try {
      await fetch(`/api/roadmaps/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roadmapId }),
      });
      console.log("cloned Roadmap");
      router.push("/my-learning");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getRoadmapDataWithId(roadmapId);
      const isCloedRes = await checkIsCloned(roadmapId);
      console.log(isCloedRes);

      setIsCloned(isCloedRes);
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
    <div className="w-full min-h-screen p-6">
      <Card className="w-full max-w-4xl mx-auto rounded-2xl shadow-md border border-[var(--primary)]/30">
        <CardHeader>
          <CardTitle className="text-2xl text-[var(--primary)]">
            {roadMap.title}
          </CardTitle>
          <CardDescription>{roadMap.description}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4 space-y-4">
          <Accordion type="single" collapsible>
            {roadMap.microtasks.map((microtask) => (
              <AccordionItem key={microtask.id} value={microtask.id}>
                <AccordionTrigger className="font-semibold text-lg text-[var(--primary)] hover:no-underline hover:bg-[var(--primary)]/10 rounded-md px-3 py-4 cursor-pointer transition">
                  {microtask.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    {microtask.tasks.map((task) => (
                      <li
                        key={task.id}
                        className="text-sm text-gray-700 leading-relaxed hover:bg-gray-50 rounded-md px-2 py-1 transition"
                      >
                        {task.title}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="flex justify-end w-full mt-10">
            {isCloned || sesssion.data?.user?.id === roadMap.ownerId ? (
              <Button
                className="px-4 py-2 text-md bg-secondary text-primary cursor-pointer hover:text-stone-800 hover:bg-stone-200 "
                variant={"secondary"}
                onClick={() => router.push(`/my-learning/${roadmapId}`)}
              >
                Go to learning
              </Button>
            ) : (
              <Button
                className="px-4 py-2 text-lg bg-primary text-secondary cursor-pointer hover:text-stone-800 hover:bg-stone-200 "
                variant={"secondary"}
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
