"use client";
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
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AddRoadmap from "@/components/custom/AddRoadmap";
import { useSession } from "next-auth/react";
import { getRoadmapDataWithId, getUserRoadMaps } from "@/services/roadmaps";
import { Roadmap as RoadMapType } from "@prisma/client";

export default function Roadmap() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [roadMaps, setRoadMaps] = useState<RoadMapType[]>([]);
  const user = useSession();
  useEffect(() => {
    (async () => {
      let data;
      if (user.data?.user?.id) {
        data = await getUserRoadMaps(user.data?.user?.id);
        setRoadMaps(data);
      }
    })();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Developer & Designer Roadmap
      </h1>
      <Button onClick={() => setIsAddFormOpen(true)}>Add a roadMap</Button>

      <div className="grid md:grid-cols-2 gap-6">
        {roadMaps.map((role) => (
          <Link key={role.id} href={`/my-learning/${role.id}`}>
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
      {isAddFormOpen ? (
        <AddRoadmap isOpen={isAddFormOpen} close={setIsAddFormOpen} />
      ) : (
        <></>
      )}
    </div>
  );
}
