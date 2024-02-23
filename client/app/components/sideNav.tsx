"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import { NavProps } from "admin";
import Image from "next/image";
import logoText from "./../../utils/logoText.png";
import { LogOut, MoveUpRight, Server } from "lucide-react";

export function SideNav({ className, items, storeUrl, ...props }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { userId } = useAuth();

  return (
    <div className="flex flex-col h-full w-full justify-start p-2.5 bg-secondary text-secondary-foreground">
      <div className="flex justify-start py-5 px-4 ">
        <Image src={logoText} alt="logoWithText" width={100} priority={true} />
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
      <div className="mt-auto flex flex-col space-y-4 align-center items-center w-full">
        {userId && (
          <div className="mt-auto text-sm md:w-5/6  rounded-3xl flex justify-between items-center space-x-2 px-2 h-16">
            <Button
              onClick={() => {
                router.push("/" + storeUrl);
              }}
              variant={"outline"}
              className="h-14 w-full bg-input text-l text-accent-foreground rounded-full border border-primary space-x-2 hover:text-foreground"
            >
              <Server className="h-5 w-5 " />
              <span>Edit Profile </span>
              <MoveUpRight className="h-5 w-5 " />
            </Button>
          </div>
        )}
        {!userId ? (
          <>
            <Button variant="outline" className="w-full">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button className="w-full">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </>
        ) : (
          <div className="w-full">
            <SignOutButton>
              <Button variant="destructive" className="w-full space-x-2">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </Button>
            </SignOutButton>
            {/* <UserButton /> */}
          </div>
        )}
      </div>
    </div>
  );
}
