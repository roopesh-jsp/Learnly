"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Pen, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ProfileForm from "./ProfileForm";

export default function Profile() {
  const { data: session, status } = useSession();
  const [isEdit, setIsEdit] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Not signed in
      </div>
    );
  }

  const { name, email, image, id } = session.user ?? {};

  return (
    <div className="py-6 px-4 grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Profile Section */}
      <div className="md:col-span-4">
        <div className="relative w-full flex justify-center md:block">
          {/* Profile Edit Form (Modal/Drawer) */}
          <ProfileForm isOpen={isEdit} close={setIsEdit} />

          {/* Edit Button */}
          <div
            className="absolute top-3 right-3 md:top-4 md:right-4 text-primary cursor-pointer hover:bg-primary/10 p-2 rounded-full transition"
            onClick={() => setIsEdit(true)}
          >
            <Pen size={18} />
          </div>

          {/* Card */}
          <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl border border-border">
            <CardHeader className="flex flex-col items-center gap-4 p-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-md">
                {image ? (
                  <Image
                    src={image}
                    alt={name ?? "User"}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Name */}
              <CardTitle className="text-xl sm:text-2xl font-semibold text-center break-words">
                {name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm px-6 pb-6">
              {/* Email */}
              {email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
              )}

              {/* Expiration */}
              <p className="text-xs text-muted-foreground text-center">
                Session expires at:{" "}
                {new Date(session.expires).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
