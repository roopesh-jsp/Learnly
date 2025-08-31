import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/signup");
  return (
    <div>
      hai
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button>logout</Button>
      </form>
    </div>
  );
}
