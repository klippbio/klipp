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
import { NavProps } from "admin";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export function BottomBar({ className, items, ...props }: NavProps) {
  const pathname = usePathname();

  return (
    // Bottom Navigation Panel Code
    <div
      className={`block fixed bottom-0 left-0 right-0 z-1 bg-secondary ${className}`}
    >
      <div className="flex justify-between p-4">
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
        <Sheet>
          <SheetTrigger asChild className="items-center flex flex-col">
            <Button variant={"ghost"} className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                <Menu size={24} />
                <span className="pt-1">Menu</span>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side={"bottom"} className="h-4/5">
            <SheetHeader>
              <SheetTitle className="text-left text-primary">
                <span className="text-2xl">klipp</span>
              </SheetTitle>
              <Separator orientation="horizontal" />
              <SheetDescription className="text-left">
                <nav
                  className={cn(
                    "flex flex-col space-y-5 align-center",
                    className
                  )}
                  {...props}
                >
                  <div className="pt-2"></div>
                  {items.map((item) =>
                    // If the pathname is the same as the item.href, then show the SheetClose button, else show the Link button
                    pathname === item.href ? (
                      <SheetClose
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "lg",
                          }),
                          "justify-start flex items-center rounded-3xl h-12 text-primary hover:bg-secondary",
                          pathname === item.href && "bg-secondary"
                        )}
                      >
                        <div className="flex flex-wrap items-center">
                          {item.icon}
                          <span className="pl-5">{item.title}</span>
                        </div>
                      </SheetClose>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "lg",
                          }),
                          "justify-start flex items-center rounded-3xl h-12 text-primary hover:bg-secondary",
                          pathname === item.href && "bg-secondary"
                        )}
                      >
                        <div className="flex flex-wrap items-center">
                          {item.icon}
                          <span className="pl-5">{item.title}</span>
                        </div>
                      </Link>
                    )
                  )}
                  <Link
                    key={"/onboarding"}
                    href={"/onboarding"}
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "lg",
                      }),
                      "justify-start flex items-center rounded-3xl h-12 text-primary hover:bg-secondary",
                      pathname === "/onboarding" && "bg-secondary"
                    )}
                  >
                    <div className="flex flex-wrap items-center">
                      <span className="pl-5">Onbaording</span>
                    </div>
                  </Link>
                </nav>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default BottomBar;
