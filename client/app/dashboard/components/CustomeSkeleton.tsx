import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function CustomeSkeleton() {
  return (
    <div>
      <Card className="w-full flex flex-col gap-4 p-5">
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
      </Card>
    </div>
  );
}

export default CustomeSkeleton;
