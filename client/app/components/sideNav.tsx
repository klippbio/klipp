"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserButton, useAuth } from "@clerk/nextjs";
import { NavProps } from "admin";
import Image from "next/image";
import logoText from "./../../utils/logoText.png";
import { SettingsIcon } from "lucide-react";

export function SideNav({ className, items, ...props }: NavProps) {
  const pathname = usePathname();

  const { userId } = useAuth();

  return (
    <>
      <div className="flex flex-col h-full w-full justify-start p-2.5 bg-secondary text-secondary-foreground">
        <div className="flex justify-start py-5 px-4 ">
          <Image
            src={logoText}
            alt="logoWithText"
            width={100}
            priority={true}
          />
        </div>
        <nav
          className={cn("flex flex-col space-y-1 align-center pt-2", className)}
          {...props}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname?.startsWith(item.baseHref) &&
                  "bg-overlay text-overlay-foreground",
                "justify-start flex items-center hover:bg-overlay hover:text-primary"
              )}
            >
              <div className="flex flex-wrap items-center">
                {item.icon}
                <span className="pl-4">{item.title}</span>
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
            <div className="flex flex-wrap items-center">
              <SettingsIcon />
              <span className="pl-2">Settings</span>
            </div>
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
