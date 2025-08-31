"use client";

// It's best practice to import from "next-auth/react" in client components
import { signIn } from "next-auth/react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center  px-4">
      <Card className="w-full max-w-md shadow-lg ">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Login
          </CardTitle>
          <CardDescription className="text-gray-500">
            Sign in to continue to{" "}
            <span className="font-semibold">Learnly</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            type="button" // Changed to "button"
            onClick={() => signIn("github")}
            variant="default"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            Sign in with GitHub
          </Button>

          <Button
            type="button" // Changed to "button"
            variant="default"
            onClick={() => signIn("google")}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
