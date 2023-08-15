import React, { use } from "react";
import Nav from "./components/Nav";
import { UserButton } from "@clerk/nextjs";

function page() {
  return (
    <div>
      <Nav />
    </div>
  );
}

export default page;
