"use client";
import Profile from "@/components/dashboard/Profile";

export default function Page() {
  return (
    <div className="py-6 grid grid-cols-12">
      <div className="col-span-4">
        <Profile />
      </div>
    </div>
  );
}
