"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import logo from "./../../utils/logo.png";
import Image from "next/image";

export default function TopBar() {
  const currentPage = usePathname();
  const pageTitle =
    currentPage.split("/")[1].charAt(0).toUpperCase() +
    currentPage.split("/")[1].slice(1);

  return (
    <div className="flex flex-col w-full">
      <div className="z-1 w-full">
        <nav className="flex sticky h-20 top-0 pl-5 min-h-[50px] items-center justify-between">
          <div className="md:hidden flex p-0 grow-0 shrink-0 basis-auto width-screen">
            <a href="/home">
              <Image src={logo} alt="logo" width={40} />
            </a>
          </div>
          <div className="hidden text-xl font-bold md:inline-flex">
            <span>{pageTitle}</span>
          </div>
          <div className="flex justify-end items-center basis-0 grow-1">
            <p className="text-right text-ellipsis whitespace-nowrap mb-0 items-center font-bold flex">
              <a href="klipp.bio" target="_blank" className="text-foreground">
                klipp.bio/meetshukla
              </a>
              <Button
                className="m-2 text-overlay-foreground border-primary"
                variant={"outline"}
              >
                <CopyIcon size={16} />
                <span className="hidden md:inline-block font-bold align-middle ">
                  Copy
                </span>
              </Button>
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
}
