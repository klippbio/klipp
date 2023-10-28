import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function DigitalDownloadSkeleton() {
  return (
    <div className="md:flex md:flex-row m-4 gap-4 flex-wrap">
      <Card className="md:w-1/3 mt-16 ml-4 w-full h-32 mb-4">
        <Skeleton className="h-8 w-40 m-4" />
        <Skeleton className="h-4 w-80 m-4" />
        <Skeleton className="h-4 w-80 m-4" />
      </Card>
      <Card className="md:w-1/3 mt-16 ml-4 w-full h-32 mb-4">
        <Skeleton className="h-8 w-40 m-4" />
        <Skeleton className="h-4 w-80 m-4" />
        <Skeleton className="h-4 w-80 m-4" />
      </Card>
      <Card className="md:w-1/3 mt-4 ml-4 w-full h-32 mb-4">
        <Skeleton className="h-8 w-40 m-4" />
        <Skeleton className="h-4 w-80 m-4" />
        <Skeleton className="h-4 w-80 m-4" />
      </Card>
      <Card className="md:w-1/3 mt-4 ml-4 w-full h-32 mb-4">
        <Skeleton className="h-8 w-40 m-4" />
        <Skeleton className="h-4 w-80 m-4" />
        <Skeleton className="h-4 w-80 m-4" />
      </Card>
      <Card className="md:w-1/3 mt-4 ml-4 w-full h-32 mb-4">
        <Skeleton className="h-8 w-40 m-4" />
        <Skeleton className="h-4 w-80 m-4" />
        <Skeleton className="h-4 w-80 m-4" />
      </Card>
      <Card className="md:w-1/3 mt-4 ml-4 w-full h-32 mb-4">
        <Skeleton className="h-8 w-40 m-4" />
        <Skeleton className="h-4 w-80 m-4" />
        <Skeleton className="h-4 w-80 m-4" />
      </Card>
    </div>
  );
}

export default DigitalDownloadSkeleton;
