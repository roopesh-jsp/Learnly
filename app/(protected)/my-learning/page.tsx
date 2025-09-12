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

type ExtendedRoadMap = RoadMapType & { isCloned?: boolean };

export default function Roadmap() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [roadMaps, setRoadMaps] = useState<ExtendedRoadMap[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useSession();

  useEffect(() => {
    (async () => {
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
    })();
  }, [user.data?.user?.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Developer & Designer Roadmap
      </h1>
      <Button onClick={() => setIsAddFormOpen(true)}>Add a Roadmap</Button>

      {loading ? (
        <ShimmerLoader />
      ) : (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {roadMaps.map((role) => {
            const isCloned = role.isCloned === true;

            return (
              <Link key={role.id} href={`/my-learning/${role.id}`}>
                <div className="relative ">
                  {/* Ribbon for cloned */}
                  {isCloned && (
                    <div className="absolute top-0 right-0 w-20 text-center rounded-bl-2xl rounded-tr-2xl   bg-amber-500 text-white text-xs font-bold py-1 shadow-md">
                      Cloned
                    </div>
                  )}

                  <Card
                    className={`rounded-2xl shadow-md transition cursor-pointer border 
                    ${
                      isCloned
                        ? "border-amber-400/40 hover:border-amber-500 hover:shadow-amber-200"
                        : "border-primary/20 hover:border-primary hover:shadow-primary/30"
                    }`}
                  >
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div>
                        <CardTitle
                          className={`text-xl ${
                            isCloned ? "text-amber-700" : "text-primary"
                          }`}
                        >
                          {role.title}
                        </CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {isAddFormOpen && (
        <AddRoadmap isOpen={isAddFormOpen} close={setIsAddFormOpen} />
      )}
    </div>
  );
}
