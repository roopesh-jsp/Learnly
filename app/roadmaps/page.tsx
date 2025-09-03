import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Code, Server, Layers, PenTool } from "lucide-react";

// roadmap data
import { roadmapData } from "@/data";

export default function Roadmap() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Developer & Designer Roadmap
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        {roadmapData.map((role) => (
          <Link key={role.id} href={`/roadmaps/${role.id}`}>
            <Card className="rounded-2xl shadow-md border border-primary/20 hover:shadow-lg hover:border-primary transition cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-3">
                <div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
