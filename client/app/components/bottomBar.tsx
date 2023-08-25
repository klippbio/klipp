"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { Ghost, LayoutDashboardIcon, RatIcon, WrapText, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { XIcon } from "lucide-react";
import path from "path";
// Bottom Bar Code
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function BottomBar({ className, items, ...props }: NavProps) {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(false); // State to control navigation visibility

  const toggleNav = () => {
    setShowNav((prevShowNav) => !prevShowNav); // Toggle the navigation visibility
  };
  return (
    <div
      className={`block fixed bottom-0 left-0 right-0 z-1 bg-secondary ${className}`}
    >
      <Separator orientation="horizontal" />
      <div className="flex justify-between p-4">
        <div className="flex flex-col items-center">
          <Link
            key={"/mypage"}
            href="/mypage"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex flex-col items-center"
            )}
          >
            <div className="flex flex-col items-center">
              <WrapText />
              <span className="pt-1">Preview</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Link
            key={"/dashboard"}
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex flex-col items-center"
            )}
          >
            <div className="flex flex-col items-center">
              <LayoutDashboardIcon />
              <span className="pt-1">Home</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Button
            onClick={toggleNav}
            variant={"ghost"}
            className="flex flex-col items-center"
          >
            <div className="flex flex-col items-center">
              <Menu size={24} />
              <span className="pt-1">Check</span>
            </div>
          </Button>
        </div>
      </div>
      {showNav && (
        <div className="relative h-screen top-0 transition-all duration-500 ease-in bg-opacity-50">
          {/* Overlay for navigation */}
          <div className="w-full p-6 h-full pb-24 overflow-y-auto bg-background flex flex-col ">
            <div className="font-bold m-5 flex">
              <span className="text-2xl">klipp</span>
              <Button className="ml-auto" variant={"ghost"} onClick={toggleNav}>
                <XIcon />
              </Button>
            </div>
            <Separator orientation="horizontal" />
            <nav
              className={cn("flex flex-col space-y-5 align-center", className)}
              {...props}
            >
              <div className="pt-2"></div>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "justify-start flex items-center rounded-3xl h-16"
                  )}
                >
                  <div className="flex flex-wrap items-center">
                    {item.icon}
                    <span className="pl-5">{item.title}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {showNav && (
        <div></div>
        // <div className="fixed inset-0 bg-gray-700 bg-opacity-50 z-50">
        //   {/* Overlay for navigation */}
        //   <nav className="absolute bottom-0 left-0 right-0 bg-white p-4">
        //     <button
        //       className="absolute top-0 right-0 p-2 font-bold"
        //       onClick={toggleNav}
        //     >
        //       <XIcon size={32} />
        //     </button>
        //     <ul>
        //       {items.map((item) => (
        //         <li key={item.title}>
        //           {item.icon}
        //           <a href={item.href}>{item.title}</a>
        //         </li>
        //       ))}
        //     </ul>
        //   </nav>
        // </div>
        // )
      )}
    </div>
  );
}

export default BottomBar;
