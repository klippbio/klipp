// app/layout.tsx
import "../globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });
import QueryWrapper from "../components/QueryWrapper";
import { SideNav } from "../components/sideNav";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { BottomBar } from "../components/bottomBar";
import { RiMenuFill } from "react-icons/ri";
import { LayoutDashboardIcon } from "lucide-react";
import { ShoppingBasketIcon } from "lucide-react";
import { WrapText } from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "My Products",
    href: "/products",
    icon: <ShoppingBasketIcon />,
  },
  {
    title: "My Page",
    href: "/mypage",
    icon: <WrapText />,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-72">
        <SideNav items={navItems} />
      </div>
      <Separator orientation="vertical" className="hidden md:block" />
      <div className="flex flex-col h-screen pb-20 md:pb-0 w-full overflow-hidden ">
        {children}
      </div>
      {/* <div className="relative flex-grow">
        <div className="p-4 h-screen md:flex md:flex-col overflow-y-auto">
          {children}
        </div>
      </div> */}
      <div className="md:hidden w-full">
        <BottomBar items={navItems} />
      </div>
    </div>
  );
}
