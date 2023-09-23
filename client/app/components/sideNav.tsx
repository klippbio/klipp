"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserButton, auth, useAuth } from "@clerk/nextjs";
import { PaperclipIcon } from "lucide-react";
import { NavProps } from "admin";

export function SideNav({ className, items, ...props }: NavProps) {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <>
      <div className="flex flex-col h-screen w-full justify-start p-2.5 bg-secondary text-secondary-foreground">
        <div className="flex justify-start text-3xl items-center p-5 pl-9">
          <PaperclipIcon size={24} />
          <span className="pl-2 text">klipp</span>
        </div>
        <nav
          className={cn(
            "flex flex-col space-y-3 align-center text-bold",
            className
          )}
          {...props}
        >
          <div className="pt-2"></div>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === item.href && "bg-overlay text-primary",
                "justify-start flex items-center font-semibold hover:bg-overlay hover:text-primary"
              )}
            >
              <div className="flex flex-wrap items-center p-1">
                {item.icon}
                <span className="pl-2">{item.title}</span>
              </div>
            </Link>
          ))}
        </nav>
        {/* Example for bottom settings */}
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
          {!userId && (
            <>
              <Button variant="outline">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
          <UserButton />
        </div>
      </div>
    </>
  );
}
