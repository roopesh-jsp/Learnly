"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Roadmap, Microtask, Task, UserTask } from "@prisma/client";
import { getUserRoadMap } from "@/services/roadmaps";
import { useSession } from "next-auth/react";
import { Pencil, Trash } from "lucide-react";
import EditProperties from "@/components/custom/EditProperties";
import DeleteRoadmap from "@/components/custom/DeleteRoadmap";

type TaskWithStatus = Task & { userTasks: UserTask[] };
type MicrotaskWithTasks = Microtask & { tasks: TaskWithStatus[] };
type RoadmapWithData = Roadmap & { microtasks: MicrotaskWithTasks[] };

export type PropertiesData = {
  title: string;
  description: string;
  isPublic: boolean;
};

const RoadMap = () => {
  const params = useParams<{ myMapId: string }>();
  const roadmapId = params.myMapId;
  const session = useSession();

  const [roadmap, setRoadmap] = useState<RoadmapWithData | null>(null);
  const [isCloned, setIsCloned] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const [taskInputs, setTaskInputs] = useState<
    Record<string, string | undefined>
  >({});
  const [addingMicro, setAddingMicro] = useState(false);
  const [newMicroTitle, setNewMicroTitle] = useState("");

  const fetchRoadmap = async () => {
    const res = await getUserRoadMap(roadmapId);
    setIsCloned(res?.ownerId !== session.data?.user?.id);
    setRoadmap(res);
  };

  useEffect(() => {
    fetchRoadmap();
  }, [roadmapId]);

  // Toggle task done
  const handleToggleTask = async (taskId: string) => {
    await fetch(`/api/tasks/${taskId}/toggle`, { method: "POST" });
    fetchRoadmap();
  };

  // Add task
  const handleAddTask = async (microtaskId: string) => {
    const title = taskInputs[microtaskId];
    if (!title?.trim()) return;

    await fetch(`/api/microtasks/${microtaskId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setTaskInputs({ ...taskInputs, [microtaskId]: undefined });
    fetchRoadmap();
  };

  // Add microtask
  const handleAddMicrotask = async () => {
    if (!newMicroTitle.trim()) return;
    await fetch(`/api/roadmaps/${roadmapId}/microtasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newMicroTitle }),
    });
    setNewMicroTitle("");
    setAddingMicro(false);
    fetchRoadmap();
  };

  const handlePropertiesUpdate = async (data: PropertiesData) => {
    try {
      const res = await fetch("/api/roadmaps", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: roadmapId }),
      });
      fetchRoadmap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/roadmaps", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roadmapId }),
      });
      console.log(res.json());

      fetchRoadmap();
    } catch (error) {
      console.log(error);
    }
  };

  if (!roadmap) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="w-full mt-20 min-h-screen p-6 relative">
      <div className="absolute top-0 right-0">
        {/* Pencil Icon for edit toggle */}
        {!isCloned && (
          <button
            onClick={() => setEditMode(!editMode)}
            className=" text-gray-600 bg-secondary p-2 rounded-lg hover:text-[var(--primary)] transition flex gap-2 items-center"
          >
            <Pencil className="w-4 h-4" /> <span>Properties</span>
          </button>
        )}
        {/*delete Icon to delete */}

        <button
          onClick={() => setDeleteMode(true)}
          className=" text-gray-600 bg-secondary p-2 rounded-lg hover:text-[var(--primary)] transition flex gap-2 items-center"
        >
          <Trash className="w-4 h-4" />{" "}
          <span>{isCloned ? "un-clone" : "Delete"}</span>
        </button>
      </div>
      <Card className="w-full max-w-5xl mt-10 mx-auto rounded-2xl shadow-lg border border-[var(--primary)]/30 relative">
        {isCloned && (
          <div className="absolute top-0 right-0 w-20 text-center rounded-bl-2xl rounded-tr-2xl   bg-amber-500 text-white text-xs font-bold py-1 shadow-md">
            Cloned
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-3xl text-[var(--primary)]">
            {roadmap.title}
          </CardTitle>
          <CardDescription>{roadmap.description}</CardDescription>

          {/* Add microtask button, hidden if cloned */}
          {!isCloned && (
            <div className="absolute top-6 right-16">
              {addingMicro ? (
                <div className="flex gap-2">
                  <Input
                    value={newMicroTitle}
                    onChange={(e) => setNewMicroTitle(e.target.value)}
                    placeholder="New microtask"
                    className="w-48"
                  />
                  <Button
                    onClick={handleAddMicrotask}
                    className="bg-[var(--primary)]"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAddingMicro(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="border-[var(--primary)] text-[var(--primary)]"
                  onClick={() => setAddingMicro(true)}
                >
                  + Add Microtask
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        <Separator />
        <CardContent className="mt-6 space-y-4">
          <Accordion type="single" collapsible className="space-y-3">
            {roadmap.microtasks.map((micro) => (
              <AccordionItem
                key={micro.id}
                value={micro.id}
                className="rounded-xl border p-3"
              >
                <div className="relative">
                  <AccordionTrigger className="font-semibold text-lg text-[var(--primary)]">
                    {micro.title}
                  </AccordionTrigger>

                  {/* Add task button, hidden if cloned */}
                  {!isCloned && (
                    <div className="absolute top-2 right-2">
                      {taskInputs[micro.id] !== undefined ? (
                        <div className="flex gap-2">
                          <Input
                            value={taskInputs[micro.id] || ""}
                            onChange={(e) =>
                              setTaskInputs({
                                ...taskInputs,
                                [micro.id]: e.target.value,
                              })
                            }
                            placeholder="New task"
                            className="w-40"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddTask(micro.id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setTaskInputs({
                                ...taskInputs,
                                [micro.id]: undefined,
                              })
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setTaskInputs({ ...taskInputs, [micro.id]: "" })
                          }
                        >
                          + Add Task
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <AccordionContent>
                  <ul className="space-y-2 mt-3 pl-4">
                    {micro.tasks.map((task) => {
                      const done = task.userTasks[0]?.done ?? false;
                      return (
                        <li
                          key={task.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() => handleToggleTask(task.id)}
                            className="h-4 w-4"
                          />
                          <span
                            className={
                              done
                                ? "line-through text-gray-500"
                                : "text-gray-700"
                            }
                          >
                            {task.title}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      {editMode && (
        <EditProperties
          isOpen={editMode}
          close={setEditMode}
          initialData={{
            title: roadmap.title,
            description: roadmap.description || "",
            isPublic: roadmap.isPublic ?? false,
          }}
          onSave={handlePropertiesUpdate}
        />
      )}
      {deleteMode && (
        <DeleteRoadmap
          close={setDeleteMode}
          isOpen={deleteMode}
          onDelete={handleDelete}
          isCloned={isCloned}
        />
      )}
    </div>
  );
};

export default RoadMap;
