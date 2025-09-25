"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Dialog from "../wrappers/Dialog";
import {
  Trash2,
  Loader2,
  Sparkle,
  FileText,
  WholeWord,
  AlertTriangle,
} from "lucide-react";
import { resolve } from "path";
import { cn } from "@/lib/utils";

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

  const [mode, setMode] = useState<"Manual" | "Ai">("Manual");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);
  const [promptErros, setPromptErros] = useState("");

  const getCredits = async () => {
    try {
      const res = await fetch("/api/credits", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data.credits);

      setCredits(data.credits);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCredits();
  }, []);

  const generateAi = async () => {
    if (
      prompt.length < 50 ||
      prompt.trim().split(/\s+/).filter(Boolean).length < 10
    ) {
      setPromptErros("Need alteast 50 characters and 10 words ");
      return;
    }
    setPromptErros("");
    setApiError("");
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:3000/api/roadmaps/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate roadmap");
      }
      const data = await res.json();
      console.log(data);
      setForm(data);
      setMode("Manual");
    } catch (error: any) {
      console.log("error on getting the roadmap by prompt", error);
      setApiError(error.message);
    } finally {
      setIsGenerating(false);
    }
    console.log(prompt);
  };

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
      {mode == "Ai" ? (
        <div className="flex w-full max-w-lg flex-col items-center justify-center text-card-foreground ">
          <h1 className="mb-6 text-3xl font-bold">Generate with AI</h1>

          <div className="mb-4 w-full">
            <Textarea
              placeholder="Type your prompt here..."
              className="min-h-[100px] resize-y"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* Validation Requirements UI */}
          <div className="mb-4 flex w-full items-start justify-between gap-6 text-sm">
            <div className="flex gap-2 text-sm font-bold capitalize px-1">
              <span className="whitespace-nowrap text-stone-600">
                credits : {credits}
              </span>
            </div>
            <div className="mb-4 flex w-full items-center justify-end gap-6 text-sm">
              <div
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  errors.charLength ? "text-destructive" : "text-emerald-500"
                )}
              >
                <FileText className="h-4 w-4" />
                <span className="font-medium">{prompt.length}</span>
                <span className="text-muted-foreground">/ 50 Chars</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 transition-colors",
                  errors.wordCount ? "text-destructive" : "text-emerald-500"
                )}
              >
                <WholeWord className="h-4 w-4" />
                <span className="font-medium">
                  {prompt.trim().split(/\s+/).filter(Boolean).length}
                </span>
                <span className="text-muted-foreground">/ 10 Words</span>
              </div>
            </div>
          </div>

          <Button
            onClick={generateAi}
            size="lg"
            className="w-full sm:w-auto disabled:bg-stone-500 disabled:cursor-progress"
            disabled={isGenerating || credits <= 0}
          >
            <Sparkle />
            {isGenerating ? "Generating ..." : "Generate"}
          </Button>
          {apiError && (
            <div className="mt-4 w-full flex items-center rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <p className="mt-4 text-sm text-muted-foreground">
            This will cost you 1 credit.
          </p>
          {/* Main Error Message */}
          {promptErros && (
            <div className="mt-2 flex items-center rounded-md border border-destructive/50 bg-destructive/10 p-2 text-sm text-destructive">
              <AlertTriangle className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>{promptErros}</span>
            </div>
          )}
        </div>
      ) : (
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
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Add Microtask button */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddMicrotask}
            >
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

          {/* actions buttons  */}
          <div className="flex gap-7 w-ful items-center justify-center">
            {/* Submit Button */}
            <Button className=" w-fit !px-9" onClick={() => setMode("Ai")}>
              <Sparkle /> AI
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
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
        </div>
      )}
    </Dialog>
  );
}
