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
import { Loader2 } from "lucide-react"; // spinner icon

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
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md relative shadow-lg overflow-hidden">
        {/* Background overlay */}

        <CardHeader className="text-center relative z-10">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Login
          </CardTitle>
          <CardDescription className="">
            Sign in to continue to{" "}
            <span className="font-semibold">Learnly</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          <Button
            type="button"
            onClick={() => handleLogin("github")}
            variant="default"
            disabled={loadingProvider === "github"}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingProvider === "github" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in with GitHub...
              </>
            ) : (
              "Sign in with GitHub"
            )}
          </Button>

          <Button
            type="button"
            onClick={() => handleLogin("google")}
            variant="default"
            disabled={loadingProvider === "google"}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loadingProvider === "google" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in with Google...
              </>
            ) : (
              "Sign in with Google"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
