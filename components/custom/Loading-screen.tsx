"use client";

import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string; // optional custom message
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white text-gray-900 dark:bg-background dark:text-foreground px-6">
      {/* Animated Loader */}
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-semibold mb-3">
        {message || "Loading your Learnly experience..."}
      </h2>

      {/* Subtext */}
      <p className="text-gray-600 dark:text-muted-foreground max-w-md">
        Please hold on while we prepare your personalized learning journey ✨
      </p>
    </div>
  );
}
