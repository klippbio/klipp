import React from "react";
import { UserButton } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Ghost, PaperclipIcon } from "lucide-react";
import { CopyIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function Page() {
  return (
    <div className="flex flex-col w-full">
      <div className="z-1 w-full">
        <nav className="flex sticky h-20 top-0 pl-5 min-h-[50px] items-center justify-between">
          <div className="md:hidden flex p-0 grow-0 shrink-0 basis-auto width-screen">
            <a href="/dashboard/">
              <PaperclipIcon size={40} />
            </a>
          </div>
          <div className="hidden md:inline-flex">
            <span>Analytics</span>
          </div>
          <div className="flex justify-end items-center basis-0 grow-1">
            <p className="text-right text-ellipsis whitespace-nowrap mb-0 items-center flex">
              <a href="https://stan.store/theminitales" target="_blank">
                stan.store/theminitales
              </a>
              <Button variant={"ghost"} className="ml-2">
                <CopyIcon size={24} />
                <span className="hidden md:inline-block font-bold align-middle">
                  Copy
                </span>
              </Button>
            </p>
          </div>
        </nav>
      </div>
      <div className="block z-1">
        <Separator orientation="horizontal" className="hidden md:block" />
      </div>
    </div>
  );
}

export default Page;
