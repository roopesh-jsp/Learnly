"use client";

import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-background text-foreground px-6">
      {/* Icon */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
        <Home className="w-10 h-10 text-primary" />
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Oops! Page Not Found
      </h1>

      {/* Message */}
      <p className="text-lg text-gray-600 dark:text-muted-foreground mb-8 max-w-md">
        The page you’re looking for doesn’t exist or may have been moved. Let’s
        get you back on track.
      </p>

      {/* Actions */}
      <div className="flex gap-4">
        <Link href="/">
          <Button size="lg">Go Home</Button>
        </Link>
        <Link href="/goals">
          <Button size="lg" variant="outline">
            View Goals
          </Button>
        </Link>
      </div>
    </div>
  );
}
