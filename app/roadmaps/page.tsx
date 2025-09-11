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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Developer & Designer Roadmap
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {roadmapData?.map((role) => (
          <Link key={role.id} href={`/roadmaps/${role.id}`}>
            <Card className="rounded-2xl shadow-md border border-primary/20 hover:shadow-lg hover:border-primary transition cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl">{role.title}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex justify-between items-center text-sm text-gray-600 mt-2">
                {/* Owner */}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>{role.owner?.name || "Unknown"}</span>
                </div>

                {/* Clones count */}
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-amber-600" />
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
