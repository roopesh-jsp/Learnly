"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const params = useParams<{ myMapId: string }>();
  const roadmapId = Number(params.myMapId);

  const roadMap: Roadmap | undefined = roadmapData.find(
    (r) => r.id === roadmapId
  );

  const [microGoals, setMicroGoals] = useState<MicroGoal[]>(
    roadMap?.microGoals || []
  );
  const [addingGoal, setAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [taskInputs, setTaskInputs] = useState<
    Record<string, string | undefined>
  >({});

  // --- Add Goal ---
  const handleAddGoalUI = () => setAddingGoal(true);

  const handleSaveGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newGoal: MicroGoal = {
      id: `new_${Date.now()}`,
      title: newGoalTitle,
      tasks: [],
    };
    setMicroGoals((prev) => [...prev, newGoal]);
    setNewGoalTitle("");
    setAddingGoal(false);
  };

  const handleCancelGoal = () => {
    setNewGoalTitle("");
    setAddingGoal(false);
  };

  // --- Add Task ---
  const handleAddTaskUI = (goalId: string) => {
    setTaskInputs({ ...taskInputs, [goalId]: "" });
  };

  const handleSaveTask = (goalId: string) => {
    const task = taskInputs[goalId];
    if (!task || !task.trim()) return;

    setMicroGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, tasks: [...g.tasks, task] } : g
      )
    );
    setTaskInputs({ ...taskInputs, [goalId]: undefined });
  };

  const handleCancelTask = (goalId: string) => {
    setTaskInputs({ ...taskInputs, [goalId]: undefined });
  };

  if (!roadMap) return <div className="p-6 text-center">Roadmap not found</div>;

  return (
    <div className="w-full min-h-screen p-6 ">
      <Card className="w-full max-w-5xl mx-auto rounded-2xl shadow-lg border border-[var(--primary)]/30 relative">
        <CardHeader>
          <CardTitle className="text-3xl text-[var(--primary)]">
            {roadMap.title}
          </CardTitle>
          <CardDescription>{roadMap.description}</CardDescription>
          <div className="absolute top-6 right-6">
            {addingGoal ? (
              <div className="flex gap-2">
                <Input
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="New micro goal"
                  className="w-48"
                />
                <Button
                  variant="default"
                  className="bg-[var(--primary)]"
                  onClick={handleSaveGoal}
                >
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancelGoal}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="border-[var(--primary)] text-[var(--primary)]"
                onClick={handleAddGoalUI}
              >
                + Add Micro Goal
              </Button>
            )}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="mt-6 space-y-4">
          <Accordion type="single" collapsible className="space-y-3">
            {microGoals.map((goal) => (
              <AccordionItem
                key={goal.id}
                value={goal.id}
                className="rounded-xl border border-gray-200 p-3 bg-white hover:bg-[var(--primary)]/10   transition"
              >
                <div className="relative">
                  <AccordionTrigger
                    className="font-semibold text-lg text-[var(--primary)] 
             hover:no-underline 
             rounded-md px-3 py-2 transition  cursor-pointer"
                  >
                    {goal.title}
                  </AccordionTrigger>
                  <div className="absolute top-2 right-2">
                    {taskInputs[goal.id] !== undefined ? (
                      <div className="flex gap-2">
                        <Input
                          value={taskInputs[goal.id] || ""}
                          onChange={(e) =>
                            setTaskInputs({
                              ...taskInputs,
                              [goal.id]: e.target.value,
                            })
                          }
                          placeholder="New task"
                          className="w-40"
                        />
                        <Button
                          size="sm"
                          className="bg-[var(--primary)]"
                          onClick={() => handleSaveTask(goal.id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelTask(goal.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[var(--primary)] text-[var(--primary)]"
                        onClick={() => handleAddTaskUI(goal.id)}
                      >
                        + Add Task
                      </Button>
                    )}
                  </div>
                </div>
                <AccordionContent>
                  <ul className="space-y-2 mt-3 pl-4">
                    {goal.tasks.map((task, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-[var(--primary)]/10 transition cursor-pointer"
                      >
                        <input type="checkbox" className="h-4 w-4" />
                        <span className="text-sm text-gray-700">{task}</span>
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
