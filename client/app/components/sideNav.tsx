"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { PaperclipIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}
export function SideNav({ className, items, ...props }: NavProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-col h-screen w-full justify-start p-2.5 md:bg-background ">
        <div className="flex justify-start text-3xl items-center p-5 pl-9">
          <PaperclipIcon size={24} />
          <span className="pl-2 text">klipp</span>
        </div>
        <Separator orientation="horizontal" className="my-4" />
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
                buttonVariants({ variant: "ghost" }),
                pathname === item.href ? "bg-secondary" : "hover:bg-background",
                "justify-start flex items-center"
              )}
            >
              <div className="flex flex-wrap items-center p-1">
                {item.icon}
                <span className="pl-4">{item.title}</span>
              </div>
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col space-y-4 align-center">
          <Link
            href={"/settings"}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "justify-start"
            )}
          >
            Settings
          </Link>
          <UserButton />
        </div>
      </div>
    </>
  );
}
