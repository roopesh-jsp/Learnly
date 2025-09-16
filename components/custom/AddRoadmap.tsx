"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Dialog from "../wrappers/Dialog";
import { Trash2, Loader2 } from "lucide-react";

interface AddRoadmapProps {
  isOpen: boolean;
  close: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  fetchRoadmaps: () => void;
}

export default function AddRoadmap({
  isOpen,
  close,
  fetchRoadmaps,
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

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

  // Add task
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

  // Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";

    form.microtasks.forEach((m, idx) => {
      if (!m.title.trim())
        newErrors[`micro-${m.id}`] = `Microtask ${idx + 1} title is required.`;
      m.tasks.forEach((t, tIdx) => {
        if (!t.title.trim())
          newErrors[`task-${t.id}`] = `Task ${tIdx + 1} in microtask ${
            idx + 1
          } is required.`;
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save roadmap");

      const data = await res.json();
      console.log("Saved roadmap:", data);

      setForm({ title: "", description: "", microtasks: [] });
      close(false);
      fetchRoadmaps();
    } catch (error) {
      console.error("Error submitting roadmap:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} close={close}>
      <div className="w-[600px] max-w-full space-y-6">
        <h1 className="text-3xl text-center font-bold text-primary tracking-tight">
          Add a Roadmap
        </h1>

        {/* Roadmap Title */}
        <div>
          <Input
            placeholder="Roadmap title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Roadmap Description */}
        <div>
          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Add Microtask button */}
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={handleAddMicrotask}>
            + Add Microtask
          </Button>
        </div>

        {/* Microtasks */}
        <div className="space-y-4">
          {form.microtasks.map((microtask, idx) => (
            <div
              key={microtask.id}
              className="border rounded-xl p-4 bg-muted/30 shadow-sm space-y-3"
            >
              {/* Microtask Header */}
              <div className="flex items-start gap-2 justify-between">
                <div className="flex-1">
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
                    className={
                      errors[`micro-${microtask.id}`] ? "border-red-500" : ""
                    }
                  />
                  {errors[`micro-${microtask.id}`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[`micro-${microtask.id}`]}
                    </p>
                  )}
                </div>
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

              {/* Tasks */}
              <div className="space-y-2 ml-6">
                {microtask.tasks.map((task, tIdx) => (
                  <div key={task.id} className="flex items-center gap-2">
                    <div className="flex-1">
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
                        className={
                          errors[`task-${task.id}`] ? "border-red-500" : ""
                        }
                      />
                      {errors[`task-${task.id}`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`task-${task.id}`]}
                        </p>
                      )}
                    </div>
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
        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Submit Roadmap"
          )}
        </Button>
      </div>
    </Dialog>
  );
}
