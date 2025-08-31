import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";

export default async function Home() {
  return (
    <div>
      hai
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
