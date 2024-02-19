import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function BookingSkeleton() {
  return (
    <div className="md:flex md:flex-row gap-4 flex-wrap">
      <Card className="w-full mb-4">
        <Skeleton className="h-6 w-1/2 m-4" />
        <Skeleton className="h-4 w-10/12 m-4" />
      </Card>
      <Card className="w-full mb-4">
        <Skeleton className="h-6 w-1/2 m-4" />
        <Skeleton className="h-4 w-10/12 m-4" />
      </Card>
      <Card className="w-full  mb-4">
        <Skeleton className="h-6 w-1/2 m-4" />
        <Skeleton className="h-4 w-10/12 m-4" />
      </Card>
      <Card className="w-full mb-4">
        <Skeleton className="h-6 w-1/2 m-4" />
        <Skeleton className="h-4 w-10/12 m-4" />
      </Card>
      <Card className="w-full  mb-4">
        <Skeleton className="h-6 w-1/2 m-4" />
        <Skeleton className="h-4 w-10/12 m-4" />
      </Card>
      <Card className="w-full h-32 mb-4">
        <Skeleton className="h-6 w-1/2 m-4" />
        <Skeleton className="h-4 w-10/12 m-4" />
      </Card>
    </div>
  );
}
