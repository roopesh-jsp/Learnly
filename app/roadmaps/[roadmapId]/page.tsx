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

import { getRoadmapDataWithId } from "@/services/roadmaps";

const RoadMap = async ({ params }: { params: { roadmapId: string } }) => {
  const roadmapId = params.roadmapId;
  const roadMap = await getRoadmapDataWithId(roadmapId);

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
        </CardContent>
      </Card>
    </div>
  );
};

export default RoadMap;
