"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { HomeIcon, WrapText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
// Bottom Bar Code
import React from "react";
import { Separator } from "@/components/ui/separator";
import logoText from "./../../utils/logoText.png";
import { NavProps } from "admin";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";

export function BottomBar({ className, items, ...props }: NavProps) {
  const pathname = usePathname();

  return (
    // Bottom Navigation Panel Code
    <div
      className={`block fixed bottom-0 left-0 right-0 z-1 bg-background overflow-hidden ${className}`}
    >
      <Separator orientation="horizontal" />
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
          key={"/home"}
          href="/home"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex flex-col items-center hover:text-overlay-foreground",
            pathname === "/home" && "text-overlay-foreground"
          )}
        >
          <div className="flex flex-col items-center">
            <HomeIcon size={20} />
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
                <Image src={logoText} alt="logoWithText" width={100} />
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
                  {items.map((item) => (
                    // If the pathname is the same as the item.href, then show the SheetClose button, else show the Link button
                    <SheetClose asChild>
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "lg",
                          }),
                          "justify-start flex items-center rounded-3xl h-12 hover:bg-overlay",
                          pathname === item.href &&
                            "bg-overlay text-overlay-foreground"
                        )}
                      >
                        <div className="flex flex-wrap items-center">
                          {item.icon}
                          <span className="pl-5">{item.title}</span>
                        </div>
                      </Link>
                    </SheetClose>
                  ))}
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
