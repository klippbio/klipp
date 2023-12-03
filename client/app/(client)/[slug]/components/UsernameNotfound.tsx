import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function UsernameNotfound({ username }: { username: string }) {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-secondary">
      <Card className="">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-foreground">
            {username} not found !
          </CardTitle>
          <CardDescription>
            This username is available! Sign up to claim it.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
