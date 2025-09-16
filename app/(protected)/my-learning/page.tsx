"use client";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AddRoadmap from "@/components/custom/AddRoadmap";
import { useSession } from "next-auth/react";
import { getUserRoadMaps } from "@/services/roadmaps";
import { Roadmap as RoadMapType } from "@prisma/client";
import ShimmerLoader from "@/components/custom/Shimer";
import {
  CircleCheckIcon,
  Copy,
  Crosshair,
  MousePointer,
  MousePointer2,
  MousePointer2Icon,
  MousePointerBanIcon,
} from "lucide-react";

type ExtendedRoadMap = RoadMapType & { isCloned?: boolean };

export default function Roadmap() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [roadMaps, setRoadMaps] = useState<ExtendedRoadMap[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useSession();
  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      if (user.data?.user?.id) {
        const data = await getUserRoadMaps(user.data?.user?.id);
        setRoadMaps(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRoadmaps();
  }, [user.data?.user?.id]);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">Your Roadmaps</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Manage your personal and cloned roadmaps. Create new learning paths or
          continue where you left off.
        </p>

        {/* Add Roadmap Button */}
        <Button onClick={() => setIsAddFormOpen(true)}>+ Add Roadmap</Button>
      </div>

      {/* Roadmaps Grid */}
      {loading ? (
        <ShimmerLoader />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadMaps.map((role) => {
            const isCloned = role.isCloned === true;

            return (
              <Link key={role.id} href={`/my-learning/${role.id}`}>
                <div className="relative">
                  {/* Cloned Ribbon */}
                  {isCloned && (
                    <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl rounded-tr-xl bg-accent text-accent-foreground text-xs font-medium shadow-sm">
                      <Copy className="w-3 h-3 inline-block mr-1" />
                      Cloned
                    </div>
                  )}

                  <Card
                    className={`h-[170px] flex flex-col justify-between rounded-xl border bg-card shadow-sm hover:shadow-lg transition cursor-pointer
        ${
          isCloned
            ? "border-accent/40 hover:border-accent"
            : "border-border hover:border-primary"
        }`}
                  >
                    <CardHeader className="space-y-2">
                      <CardTitle
                        className={`text-lg font-semibold truncate ${
                          isCloned ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {role.title}
                      </CardTitle>
                      <CardDescription className=" text-muted-foreground whitespace-pre-line break-words  line-clamp-3">
                        {role.description}
                      </CardDescription>
                    </CardHeader>
                    <div className="absolute bottom-3 right-3 flex gap-1 text-xs items-center font-extralight opacity-50 ">
                      <Crosshair size={15} /> click
                    </div>
                  </Card>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {isAddFormOpen && (
        <AddRoadmap
          isOpen={isAddFormOpen}
          fetchRoadmaps={fetchRoadmaps}
          close={setIsAddFormOpen}
        />
      )}
    </div>
  );
}
