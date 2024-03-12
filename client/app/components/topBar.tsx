// app/components/topBar.tsx
"use client";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import logo from "./../../utils/logo.png";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthDetails } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { NavItem } from "../dashboard/layout";

export default function TopBar({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const authDetails = useAuthDetails();
  const url = "klipp.io/" + authDetails?.storeUrl;
  const { toast } = useToast();

  const findActiveItem = (navItems: NavItem[]) => {
    let activeItem = navItems.find((item) => pathname === item.href);
    if (!activeItem) {
      navItems.some((item) => {
        const foundSubItem = item.pageNavItems?.find(
          (subItem) => pathname === subItem.href
        );
        if (foundSubItem) {
          activeItem = item;
          return true;
        }
        return false;
      });
    }

    activeItem = navItems.find((item) => {
      if (item.baseHref === "/dashboard" && pathname === "/dashboard") {
        return true;
      }
      return (
        pathname.startsWith(item.baseHref) && item.baseHref !== "/dashboard"
      );
    });

    return activeItem;
  };
  const currentPageItem = findActiveItem(items);
  const pageTitle = currentPageItem?.title;

  return (
    <div className={className}>
      <div className="z-1 flex flex-col mt-2 w-full">
        <nav className="w-full flex h-16 min-h-[50px] items-center justify-between">
          <div className="md:hidden">
            <a href="/dashboard">
              <Image src={logo} alt="logo" width={40} />
            </a>
          </div>
          <div className="hidden text-2xl font-bold md:inline-flex text-right text-ellipsis whitespace-nowrap items-center">
            <span>{pageTitle}</span>
          </div>
          {authDetails?.storeUrl && (
            <div className="flex justify-end items-center space-x-2 ">
              <a
                href={"https://" + url}
                target="_blank"
                className="text-foreground font-bold"
              >
                {url}
              </a>
              <Button
                className="text-overlay-foreground border-primary"
                variant={"outline"}
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  toast({
                    title: "Copied to clipboard!",
                    duration: 1000,
                  });
                }}
              >
                <CopyIcon size={16} />
                <span className="hidden md:inline-block font-bold align-middle ">
                  Copy
                </span>
              </Button>
            </div>
          )}
        </nav>
        <ScrollArea className="w-full whitespace-nowrap">
          {currentPageItem?.pageNavItems?.map((item) => (
            <Link
              className={cn(
                "mr-2 font-medium text-muted-foreground",
                buttonVariants({
                  variant: "outline",
                  className: "rounded-3xl",
                }),
                pathname.startsWith(item.href)
                  ? "font-bold text-overlay-foreground border-primary"
                  : ""
              )}
              key={item.href}
              href={item.href}
            >
              {item.title}
            </Link>
          ))}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
