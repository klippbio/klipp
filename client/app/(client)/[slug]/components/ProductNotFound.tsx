import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ProductNotFound() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-screen w-full bg-secondary">
      <Card className="">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-foreground">
            Product not found !
          </CardTitle>
          <CardDescription>
            Whoops! We could not find anything at that location.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button asChild onClick={() => router.back()}>
            <div>Back</div>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
