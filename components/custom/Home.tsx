"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  BarChart3,
  Trophy,
  CalendarDays,
  Download,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();
  return (
    <div className="min-h-screen md:mt-16 bg-background text-foreground">
      <div className="px-6">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-24">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 flex flex-col md:gap-2">
            <span>Learnly – Smarter</span>
            <span className="text-primary"> Roadmap Monitoring</span>
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mb-8">
            Create, share, and clone learning roadmaps. Stay updated with owner
            changes, collaborate with groups, generate quizzes, download
            worksheets, and leverage AI to design your personalized learning
            journey.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button size="lg" onClick={() => router.push("/roadmaps")}>
              Explore Roadmaps
            </Button>
            <Button size="lg" variant="outline">
              How It Works
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <h1 className="md:text-5xl text-3xl mt-10 text-center font-semibold">
          Why Choose Learnly?
        </h1>

        <section className="pt-10 pb-16 flex flex-wrap justify-center gap-8">
          {/* Feature 1 */}
          <Card className="rounded-2xl shadow-sm hover:shadow-lg transition flex-1 min-w-[280px] max-w-[350px]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Create & Share</h3>
              <p className="text-sm text-muted-foreground">
                Build your own roadmaps and share them publicly or within your
                group.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="rounded-2xl shadow-sm hover:shadow-lg transition flex-1 min-w-[280px] max-w-[350px]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Clone & Stay Synced
              </h3>
              <p className="text-sm text-muted-foreground">
                Clone others’ roadmaps and get instant updates whenever the
                owner makes changes.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="rounded-2xl shadow-sm hover:shadow-lg transition flex-1 min-w-[280px] max-w-[350px]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <CalendarDays className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                AI-Powered Roadmaps
              </h3>
              <p className="text-sm text-muted-foreground">
                Use AI to generate customized learning paths tailored to your
                goals.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="rounded-2xl shadow-sm hover:shadow-lg transition flex-1 min-w-[280px] max-w-[350px]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Trophy className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Group Study Made Easy
              </h3>
              <p className="text-sm text-muted-foreground">
                Collaborate with peers, monitor progress, and stay motivated
                with collective learning.
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 - Goal-specific Quizzes */}
          <Card className="rounded-2xl shadow-sm hover:shadow-lg transition flex-1 min-w-[280px] max-w-[350px]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <HelpCircle className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Interactive Quizzes
              </h3>
              <p className="text-sm text-muted-foreground">
                Generate goal-specific quizzes for smarter, interactive learning
                and self-assessment.
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 - Download Worksheets */}
          <Card className="rounded-2xl shadow-sm hover:shadow-lg transition flex-1 min-w-[280px] max-w-[350px]">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Download className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Printable Worksheets
              </h3>
              <p className="text-sm text-muted-foreground">
                Download structured worksheets for offline practice and
                revision.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
