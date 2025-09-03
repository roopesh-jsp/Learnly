"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, BarChart3, Trophy, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();
  return (
    <div className="min-h-screen md:mt-16 bg-white text-gray-900 dark:bg-background dark:text-foreground">
      <div className=" px-6">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-24">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 flex flex-col md:gap-2">
            <span>Learnly – Your Personalized</span>

            <span className="text-[#3F72AF] "> Learning Tracker</span>
          </h1>
          <p className="text-md md:text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mb-8">
            Achieve your educational goals with AI-powered micro-goals, progress
            reports, and gamified motivation. Stay consistent. Stay motivated.
            Stay ahead.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button size="lg" onClick={() => router.push("/roadmaps")}>
              Get Started
            </Button>

            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </section>

        <h1 className="md:text-5xl text-3xl  mt-10 text-center font-semibold">
          What you get Here
        </h1>
        {/* Features Section */}
        <section className="pt-10 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="rounded-2xl shadow-sm hover:shadow-lg transition">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Intelligent Goal Breakdown
              </h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">
                Big goals transformed into actionable micro-steps with AI
                guidance.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm hover:shadow-lg transition">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Progress Visualization
              </h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">
                Track your learning journey with clean charts and insights.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm hover:shadow-lg transition">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <CalendarDays className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Google Calendar Sync
              </h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">
                Plan your study sessions effortlessly with calendar integration.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm hover:shadow-lg transition">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Trophy className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Gamified Motivation
              </h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">
                Earn badges and rewards for streaks and milestones.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
