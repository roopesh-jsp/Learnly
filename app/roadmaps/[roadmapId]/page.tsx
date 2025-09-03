"use client";

import { useParams } from "next/navigation";
import { roadmapData } from "@/data";
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

// ---- Types ----
type MicroGoal = {
  id: string;
  title: string;
  tasks: string[];
};

type Roadmap = {
  id: number;
  title: string;
  description: string;
  microGoals: MicroGoal[];
};

const RoadMap = () => {
  const params = useParams<{ roadmapId: string }>();
  const roadmapId = Number(params.roadmapId);

  const roadMap: Roadmap | undefined = roadmapData.find(
    (r) => r.id === roadmapId
  );

  if (!roadMap) return <div className="p-6 text-center">Roadmap not found</div>;

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
            {roadMap.microGoals.map((goal) => (
              <AccordionItem key={goal.id} value={goal.id}>
                <AccordionTrigger
                  className="font-semibold text-lg text-[var(--primary)] 
                             hover:no-underline hover:bg-[var(--primary)]/10 
                             rounded-md px-3 py-4 cursor-pointer transition"
                >
                  {goal.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    {goal.tasks.map((task, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 leading-relaxed hover:bg-gray-50 rounded-md px-2 py-1 transition"
                      >
                        {task}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadMap;
