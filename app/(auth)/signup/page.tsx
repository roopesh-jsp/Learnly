import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/");

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
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <Button
              type="submit"
              variant="default"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            >
              Sign in with GitHub
            </Button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button
              type="submit"
              variant="default"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            >
              Sign in with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
