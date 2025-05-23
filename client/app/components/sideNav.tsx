"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import logoText from "./../../utils/logoText.png";
import { LogOut, MoveUpRight, Server } from "lucide-react";
import { useAuthDetails } from "./AuthContext";
import { Separator } from "@/components/ui/separator";
import { NavItem } from "../dashboard/layout";

export function SideNav({
  className,
  items,
  ...props
}: {
  items: NavItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const authDetails = useAuthDetails();

  const { userId } = useAuth();

  return (
    <>
      <div className="flex flex-col h-full w-full justify-start p-2.5 bg-secondary text-secondary-foreground z-15">
        <div className="flex justify-start py-5 px-4 ">
          <Image
            src={logoText}
            alt="logoWithText"
            width={100}
            priority={true}
          />
        </div>
        <nav
          className={cn("flex flex-col space-y-2 align-center pt-4", className)}
          {...props}
        >
          {items.map((item) => {
            // Check if the current pathname exactly matches "/dashboard" for the Dashboard item.
            const isDashboardActive =
              item.baseHref === "/dashboard" && pathname === "/dashboard";
            // For other items, check if the pathname starts with the item's baseHref and is not just "/dashboard".
            const isOtherItemActive =
              item.baseHref !== "/dashboard" &&
              pathname.startsWith(item.baseHref);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  (isDashboardActive || isOtherItemActive) &&
                    "bg-overlay text-overlay-foreground",
                  "justify-start flex items-center hover:bg-overlay hover:text-primary"
                )}
              >
                <div className="flex flex-wrap items-center">
                  {item.icon}
                  <span className="pl-4">{item.title}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Example for bottom settings */}
        <div className="mt-auto flex flex-col space-y-4 align-center items-center w-full">
          {userId && (
            <div className="mt-auto text-sm md:w-5/6  rounded-3xl flex justify-between items-center space-x-2 px-2 h-16">
              <Button
                onClick={() => {
                  router.push("/" + authDetails?.storeUrl);
                }}
                variant={"outline"}
                className="h-14 w-full bg-input text-l text-accent-foreground    border border-primary space-x-2 hover:text-foreground"
              >
                <Server className="h-5 w-5" />
                <span>Edit Profile </span>
                <MoveUpRight className="h-5 w-5" />
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
              <Separator className="my-2" />
              <SignOutButton>
                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </Button>
              </SignOutButton>
              {/* <UserButton /> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
