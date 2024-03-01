// app/layout.tsx
"use client";
import "../globals.css";
import { SideNav } from "../components/sideNav";
import { BottomBar } from "../components/bottomBar";
import {
  DollarSignIcon,
  BadgeDollarSign,
  CalendarCheck,
  CalendarClock,
  FileCheck2,
  Link,
} from "lucide-react/";
import { HomeIcon } from "lucide-react/";
import { Separator } from "@/components/ui/separator";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    {
      title: "Home",
      href: "/dashboard/home",
      baseHref: "/dashboard/home",
      icon: <HomeIcon size={20} />,
    },
    {
      title: "Links",
      href: "/dashboard/links",
      baseHref: "/dashboard/links",
      icon: <Link size={20} />,
    },
    {
      title: "Digital Products",
      href: "/dashboard/digital-products",
      baseHref: "/dashboard/digital-products",
      icon: <FileCheck2 size={20} />,
    },
    {
      title: "Calendar Products",
      href: "/dashboard/calendar/products",
      baseHref: "/dashboard/calendar",
      icon: <CalendarClock size={20} />,
    },
    {
      title: "My Bookings",
      href: "/dashboard/bookings",
      baseHref: "/dashboard/bookings",
      icon: <CalendarCheck size={20} />,
    },
    {
      title: "Sales",
      href: "/dashboard/sales",
      baseHref: "/dashboard/sales",
      icon: <BadgeDollarSign size={20} />,
    },
    {
      title: "Payment Settings",
      href: "/dashboard/payments",
      baseHref: "/dashboard/payments",
      icon: <DollarSignIcon size={20} />,
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-64 fixed top-0 h-full z-50">
        <SideNav items={navItems} />
        <Separator orientation="vertical" />
      </div>
      <div className="flex flex-col md:pl-64 h-screen pb-20 md:pb-0 w-full">
        {children}
      </div>
      <div className="md:hidden w-full">
        <BottomBar items={navItems} />
      </div>
    </div>
  );
}
