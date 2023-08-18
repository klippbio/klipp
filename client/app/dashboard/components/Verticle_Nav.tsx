import React from "react";
import { UserButton } from "@clerk/nextjs";

function Verticle_Nav() {
  return (
    <div>
      <div className="flex h-screen bg-red-200">
        <div className="border bg-red flex flex-col justify-between w-64 px-6 py-8 space-y-6">
          <div className="text-2xl font-bold text-neutral text-black">
            GrowthDeck
          </div>
          <nav className="space-y-2 text-gray-800">
            <div className="flex justify-between items-end">
              <div>
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </nav>
        </div>
        <div className="flex-1 p-10"></div>
      </div>
    </div>
  );
}

export default Verticle_Nav;
