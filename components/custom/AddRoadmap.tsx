"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { Dispatch, SetStateAction } from "react";

import Dialog from "../wrappers/Dialog";
import { Trash2 } from "lucide-react";

interface AddRoadmapProps {
  isOpen: boolean;
  close: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
}

export default function AddRoadmap({
  isOpen,
  close,
  children,
}: AddRoadmapProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    microtasks: [] as {
      id: string;
      title: string;
      tasks: { id: string; title: string }[];
    }[],
  });

  // Add microtask
  const handleAddMicrotask = () => {
    setForm((prev) => ({
      ...prev,
      microtasks: [
        ...prev.microtasks,
        { id: crypto.randomUUID(), title: "", tasks: [] },
      ],
    }));
  };

  // Add task inside a microtask
  const handleAddTask = (microtaskId: string) => {
    setForm((prev) => ({
      ...prev,
      microtasks: prev.microtasks.map((m) =>
        m.id === microtaskId
          ? {
              ...m,
              tasks: [...m.tasks, { id: crypto.randomUUID(), title: "" }],
            }
          : m
      ),
    }));
  };

  // Delete microtask
  const handleDeleteMicrotask = (microtaskId: string) => {
    setForm((prev) => ({
      ...prev,
      microtasks: prev.microtasks.filter((m) => m.id !== microtaskId),
    }));
  };

  // Delete task
  const handleDeleteTask = (microtaskId: string, taskId: string) => {
    setForm((prev) => ({
      ...prev,
      microtasks: prev.microtasks.map((m) =>
        m.id === microtaskId
          ? { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) }
          : m
      ),
    }));
  };

  // Submit form
  const handleSubmit = () => {
    console.log("Roadmap form:", form);
    close(false);
  };

  return (
    <Dialog isOpen={isOpen} close={close}>
      <div className="w-2xl space-y-4">
        <h1 className="text-3xl text-center font-bold text-[var(--primary)] tracking-tight">
          Add a Roadmap
        </h1>

        {/* Roadmap Title */}
        <Input
          placeholder="Roadmap title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        {/* Roadmap Description */}
        <Input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Add Microtask button (top-right below description) */}
        <div className="flex justify-end">
          <Button type="button" onClick={handleAddMicrotask}>
            + Add Microtask
          </Button>
        </div>

        {/* Microtasks */}
        <div className="space-y-4">
          {form.microtasks.map((microtask, idx) => (
            <div key={microtask.id} className="border p-3 rounded-md space-y-2">
              {/* Microtask Header */}
              <div className="flex items-center gap-2 justify-between">
                <Input
                  placeholder={`Microtask ${idx + 1}`}
                  value={microtask.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      microtasks: form.microtasks.map((m) =>
                        m.id === microtask.id
                          ? { ...m, title: e.target.value }
                          : m
                      ),
                    })
                  }
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAddTask(microtask.id)}
                  >
                    + Add Task
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteMicrotask(microtask.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>

              {/* Tasks inside microtask */}
              <div className="space-y-2 ml-4">
                {microtask.tasks.map((task, tIdx) => (
                  <div key={task.id} className="flex items-center gap-2">
                    <Input
                      placeholder={`Task ${tIdx + 1}`}
                      value={task.title}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          microtasks: form.microtasks.map((m) =>
                            m.id === microtask.id
                              ? {
                                  ...m,
                                  tasks: m.tasks.map((t) =>
                                    t.id === task.id
                                      ? { ...t, title: e.target.value }
                                      : t
                                  ),
                                }
                              : m
                          ),
                        })
                      }
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteTask(microtask.id, task.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <Button className="w-full" onClick={handleSubmit}>
          Submit Roadmap
        </Button>
      </div>
    </Dialog>
  );
}
