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
import { checkIsCloned, getUserRoadMap } from "@/services/roadmaps";
import { useSession } from "next-auth/react";
import { Pencil, Trash } from "lucide-react";
import EditProperties from "@/components/custom/EditProperties";
import DeleteRoadmap from "@/components/custom/DeleteRoadmap";
import ShimmerLoader from "@/components/custom/Shimer";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const fetchRoadmap = async () => {
    try {
      const res = await getUserRoadMap(roadmapId);
      // setIsCloned(res?.ownerId !== session.data?.user?.id);
      // console.log(res?.ownerId, session.data?.user?.id);

      setRoadmap(res);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    fetchRoadmap();
    if (roadmapId)
      (async () => {
        const isClonedRes = await checkIsCloned(roadmapId);
        setIsCloned(isClonedRes);
      })();
  }, [roadmapId]);

  // Toggle task done
  const handleToggleTask = async (taskId: string, microtaskId: string) => {
    if (!roadmap) return;

    // 1. Optimistically update local state
    setRoadmap((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        microtasks: prev.microtasks.map((micro) =>
          micro.id === microtaskId
            ? {
                ...micro,
                tasks: micro.tasks.map((task) =>
                  task.id === taskId
                    ? {
                        ...task,
                        userTasks: [
                          {
                            ...task.userTasks[0],
                            done: !(task.userTasks[0]?.done ?? false),
                          },
                        ],
                      }
                    : task
                ),
              }
            : micro
        ),
      };
    });

    // 2. Call API in background
    try {
      await fetch(`/api/tasks/${taskId}/toggle`, { method: "POST" });
    } catch (error) {
      console.error("Toggle failed", error);
      fetchRoadmap(); // fallback to resync if server fails
    }
  };

  // Add task
  const handleAddTask = async (microtaskId: string) => {
    const title = taskInputs[microtaskId];
    if (!title?.trim() || !roadmap) return;

    // 1. Optimistically add new task
    const tempId = `temp-${Date.now()}`;
    setRoadmap((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        microtasks: prev.microtasks.map((micro) =>
          micro.id === microtaskId
            ? {
                ...micro,
                tasks: [
                  ...micro.tasks,
                  {
                    id: tempId,
                    title,
                    userTasks: [{ done: false }],
                  } as any, // temporary until backend gives real task
                ],
              }
            : micro
        ),
      };
    });

    // reset input field
    setTaskInputs({ ...taskInputs, [microtaskId]: undefined });

    // 2. Sync with server
    try {
      await fetch(`/api/microtasks/${microtaskId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      fetchRoadmap(); // resync for real IDs
    } catch (error) {
      console.error("Add task failed", error);
      fetchRoadmap();
    }
  };

  // Add microtask
  const handleAddMicrotask = async () => {
    if (!newMicroTitle.trim() || !roadmap) return;

    const tempId = `temp-${Date.now()}`;

    // optimistic update
    setRoadmap((prev) =>
      prev
        ? {
            ...prev,
            microtasks: [
              ...prev.microtasks,
              { id: tempId, title: newMicroTitle, tasks: [] } as any,
            ],
          }
        : prev
    );

    setNewMicroTitle("");
    setAddingMicro(false);

    try {
      await fetch(`/api/roadmaps/${roadmapId}/microtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newMicroTitle }),
      });
      fetchRoadmap(); // resync
    } catch (error) {
      console.error("Add microtask failed", error);
      fetchRoadmap();
    }
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
      router.push("/my-learning");
    } catch (error) {
      console.log(error);
    }
  };

  // Delete a microtask
  const handleDeleteMicrotask = async (microtaskId: string) => {
    if (!roadmap) return;

    // Optimistically remove it
    setRoadmap((prev) =>
      prev
        ? {
            ...prev,
            microtasks: prev.microtasks.filter((m) => m.id !== microtaskId),
          }
        : prev
    );

    try {
      await fetch(`/api/microtasks/${microtaskId}`, { method: "DELETE" });
      fetchRoadmap(); // resync
    } catch (error) {
      console.error("Delete microtask failed", error);
      fetchRoadmap();
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId: string, microtaskId: string) => {
    if (!roadmap) return;

    // Optimistically remove it
    setRoadmap((prev) =>
      prev
        ? {
            ...prev,
            microtasks: prev.microtasks.map((m) =>
              m.id === microtaskId
                ? { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) }
                : m
            ),
          }
        : prev
    );

    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      fetchRoadmap(); // resync
    } catch (error) {
      console.error("Delete task failed", error);
      fetchRoadmap();
    }
  };

  if (!roadmap)
    return (
      <div className="p-6 text-center">
        <ShimmerLoader />
      </div>
    );

  return (
    <div className="w-full mt-20 min-h-screen p-6 relative ">
      {/* Top action buttons */}
      <div className="flex gap-3 absolute top-4 right-4">
        {!isCloned && (
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-full 
                 bg-white/70 backdrop-blur-md border border-primary/20 
                 text-[var(--primary)] font-medium shadow-sm 
                 hover:bg-[var(--primary)] hover:text-white hover:shadow-lg 
                 transition-all cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
            <span>Properties</span>
          </button>
        )}

        <button
          onClick={() => setDeleteMode(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full 
               bg-white/70 backdrop-blur-md border border-red-200 
               text-red-600 font-medium shadow-sm 
               hover:bg-red-500 hover:text-white hover:shadow-lg 
               transition-all cursor-pointer"
        >
          <Trash className="w-4 h-4" />
          <span>{isCloned ? "Un-clone" : "Delete"}</span>
        </button>
      </div>

      {/* Roadmap Card */}
      <Card className="w-full max-w-5xl mt-14 mx-auto rounded-2xl shadow-lg border border-[var(--primary)]/20 bg-gradient-to-b from-primary/5 via-background to-background text-card-foreground relative">
        {isCloned && (
          <div className="absolute top-0 right-0 w-24 text-center rounded-bl-2xl rounded-tr-2xl bg-amber-500 text-white text-xs font-semibold py-1 shadow-md">
            Cloned
          </div>
        )}

        {/* Header */}
        <CardHeader className="text-center space-y-3 pb-6">
          <CardTitle className="text-3xl font-bold text-[var(--primary)]">
            {roadmap.title}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {roadmap.description}
          </CardDescription>

          {/* Add Microtask button */}
          {!isCloned && (
            <div className="mt-4">
              {addingMicro ? (
                <div className="flex gap-2 justify-center">
                  <Input
                    value={newMicroTitle}
                    onChange={(e) => setNewMicroTitle(e.target.value)}
                    placeholder="New microtask"
                    className="w-56"
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

        {/* Content */}
        <CardContent className="mt-4 space-y-6">
          {roadmap.microtasks.length === 0 ? (
            <div className="text-center text-muted-foreground italic py-10">
              🚀 Nothing here yet...{" "}
              {isCloned
                ? "Ask the owner to add microtasks."
                : "Start by adding a new microtask!"}
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {roadmap.microtasks.map((micro) => (
                <AccordionItem
                  key={micro.id}
                  value={micro.id}
                  className="rounded-xl border border-border bg-card/60 shadow-sm overflow-hidden"
                >
                  <div className="relative">
                    <AccordionTrigger className="font-semibold text-lg text-[var(--primary)] px-4 py-3 hover:bg-[var(--primary)]/5 hover:no-underline transition">
                      {micro.title}
                    </AccordionTrigger>

                    {/* Task buttons */}
                    {!isCloned && (
                      <div className="absolute top-2 right-3 flex gap-2">
                        {taskInputs[micro.id] !== undefined ? (
                          <>
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
                          </>
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
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteMicrotask(micro.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <AccordionContent>
                    {micro.tasks.length === 0 ? (
                      <div className="text-sm text-gray-400 italic pl-6 py-3">
                        ✨ No tasks yet {isCloned ? "" : "— add one now!"}
                      </div>
                    ) : (
                      <ul className="space-y-2 mt-3 pl-6">
                        {micro.tasks.map((task) => {
                          const done = task.userTasks[0]?.done ?? false;
                          return (
                            <li
                              key={task.id}
                              onClick={() =>
                                handleToggleTask(task.id, micro.id)
                              }
                              className="flex items-center gap-3 my-5 p-3 cursor-pointer rounded-lg bg-gray-50/70 hover:bg-gray-100 transition shadow-sm"
                            >
                              {/* Round custom toggle */}
                              <button
                                className={`w-5 h-5 flex items-center justify-center rounded-full border transition
                          ${
                            done
                              ? "bg-green-500 border-green-500"
                              : "border-gray-400 bg-white"
                          }`}
                              >
                                {done && (
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>

                              {/* Task text */}
                              <span
                                className={`text-sm font-medium${
                                  done
                                    ? "line-through text-gray-400"
                                    : "text-gray-700"
                                }`}
                              >
                                {task.title}
                              </span>

                              {!isCloned && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-500 ml-auto hover:bg-red-100 rounded-full"
                                  onClick={() =>
                                    handleDeleteTask(task.id, micro.id)
                                  }
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
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
