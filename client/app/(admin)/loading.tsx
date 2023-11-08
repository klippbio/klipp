import { Loader2 } from "lucide-react";
import React from "react";

function loading() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

export default loading;
