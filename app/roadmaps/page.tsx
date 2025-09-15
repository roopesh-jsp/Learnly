import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { User, Copy } from "lucide-react"; // icons
import { getRoadmapsData } from "@/services/roadmaps";

export default async function Roadmap() {
  const roadmapData = await getRoadmapsData();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">
          Explore Community Roadmaps
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse curated learning paths created by developers and learners like
          you. Clone a roadmap, stay synced with updates from the owner, or
          build your own from scratch.
        </p>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roadmapData?.map((role) => (
          <Link key={role.id} href={`/roadmaps/${role.id}`}>
            <Card className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-lg hover:border-primary transition cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {role.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {role.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                {/* Owner */}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>{role.owner?.name || "Unknown"}</span>
                </div>

                {/* Clones count */}
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-accent" />
                  <span>{role._count?.clones ?? 0}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
