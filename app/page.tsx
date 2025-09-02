import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import { Hero } from "@/components/custom/Home";

export default async function Home() {
  const user = await auth();
  return (
    <div>
      <Hero />
    </div>
  );
}
