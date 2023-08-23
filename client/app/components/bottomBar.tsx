"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { RatIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import path from "path";
// Bottom Bar Code
import React, { useState } from "react";

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
    <div className={`block fixed bottom-0 left-0 right-0 z-1 ${className}`}>
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
              <Menu size={24} />
              <span className="pt-1">Check</span>
            </div>
          </Link>
        </div>
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
              <Menu size={24} />
              <span className="pt-1">Check</span>
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
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 z-50">
          {/* Overlay for navigation */}
          <nav className="absolute bottom-0 left-0 right-0 bg-white p-4">
            <button className="absolute top-0 right-0 p-2" onClick={toggleNav}>
              Close {/* Close button */}
            </button>
            <ul>
              {items.map((item) => (
                <li key={item.title}>
                  {item.icon}
                  <a href={item.href}>{item.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default BottomBar;
