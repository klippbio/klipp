"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { HomeIcon, Server, WrapText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
// Bottom Bar Code
import React from "react";
import { Separator } from "@/components/ui/separator";
import logoText from "./../../utils/logoText.png";
import { NavProps } from "admin";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import { useAuthDetails } from "./AuthContext";

export function BottomBar({ className, items, ...props }: NavProps) {
  const pathname = usePathname();
  const authDetails = useAuthDetails();

  return (
    // Bottom Navigation Panel Code
    <div
      className={`block fixed bottom-0 left-0 right-0 z-1 bg-background  ${className}`}
    >
      <Separator orientation="horizontal" />
      <div className="flex justify-between p-4">
        <Link
          key={`/` + authDetails?.storeUrl}
          href={`/` + authDetails?.storeUrl}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex flex-col items-center hover:bg-background"
          )}
        >
          <div className="flex flex-col items-center">
            <Server size={20} />
            <span className="pt-1 text-sm">Preview </span>
          </div>
        </Link>
        <Link
          key={"/dashboard"}
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "flex flex-col items-center hover:bg-background ",
            pathname === "/dashboard" && "text-overlay-foreground"
          )}
        >
          <div className="flex flex-col items-center">
            <HomeIcon size={20} />
            <span className="pt-1">Dashboard</span>
          </div>
        </Link>
        <Drawer>
          <DrawerTrigger
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex flex-col items-center hover:bg-background "
            )}
          >
            <div className="flex flex-col items-center">
              <Menu size={20} />
              <span className="pt-1">Menu</span>
            </div>
          </DrawerTrigger>
          <DrawerContent className="h-4/5">
            <DrawerHeader>
              <DrawerTitle className="text-left text-primary mb-2">
                <Image
                  src={logoText}
                  alt="logoWithText"
                  width={100}
                  priority={true}
                />
              </DrawerTitle>
              <Separator orientation="horizontal" />
            </DrawerHeader>
            <DrawerDescription className="text-left overflow-y-scroll pb-5">
              <nav
                className={cn(
                  "flex flex-col space-y-5 align-center p-4 ",
                  className
                )}
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
                    // If the pathname is the same as the item.href, then show the SheetClose button, else show the Link button
                    <DrawerClose asChild key={item.href}>
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "lg",
                          }),
                          "justify-start flex items-center rounded-3xl h-12 hover:bg-overlay",
                          (isDashboardActive || isOtherItemActive) &&
                            "bg-overlay text-overlay-foreground"
                        )}
                      >
                        <div className="flex flex-wrap items-center">
                          {item.icon}
                          <span className="pl-5">{item.title}</span>
                        </div>
                      </Link>
                    </DrawerClose>
                  );
                })}
              </nav>
            </DrawerDescription>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

export default BottomBar;
