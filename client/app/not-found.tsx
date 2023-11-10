import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-secondary">
      <Card className="md:w-1/4 ">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-foreground">
            404 Not Found
          </CardTitle>
          <CardDescription>
            Whoops! We couldn't find anything at that location.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/home">Take me home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
