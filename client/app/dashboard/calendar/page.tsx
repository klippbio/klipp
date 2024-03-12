"use client";
import { useRouter } from "next/navigation";
import React from "react";

function Page() {
  const router = useRouter();
  router.push("/dashboard/calendar/products");
  return <div></div>;
}

export default Page;
