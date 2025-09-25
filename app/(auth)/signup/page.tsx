"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Loader2, Lock } from "lucide-react"; // spinner icon

const Page = () => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleLogin = async (provider: string) => {
    setLoadingProvider(provider);
    console.log("clicked");

    try {
      await signIn(provider);
    } finally {
      // If signIn redirects, this won't matter, but good fallback
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex my-20 min-h-[400px] items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-950/50 border dark:border-slate-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Sign in to continue to{" "}
            <span className="font-semibold text-sky-500 dark:text-sky-400">
              Learnly
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {/* --- Google Button --- */}
          {/* <Button
            type="button"
            variant="outline"
            onClick={() => handleLogin("google")}
            disabled={loadingProvider === "google"}
            className="w-full py-5 text-slate-700 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            {loadingProvider === "google" ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Lock className="mr-2 h-5 w-5" />
            )}
            Sign in with Google
          </Button> */}

          {/* --- GitHub Button --- */}
          <Button
            type="button"
            onClick={() => handleLogin("github")}
            disabled={loadingProvider === "github"}
            className="w-full py-5 bg-[#24292F] hover:bg-[#24292F]/90 text-white"
          >
            {loadingProvider === "github" ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Lock className="mr-2 h-5 w-5" />
            )}
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
