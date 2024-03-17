"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <html>
      <body>
        <div className="flex items-center justify-center h-full w-full">
          <Card className="bg-secondary">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold text-foreground">
                Internal Server Error
              </CardTitle>
              <CardDescription>
                Whoops! We are sorry, that should not have happened !
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/">Take me home</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  );
}
