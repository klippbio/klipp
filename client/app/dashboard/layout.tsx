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
import TopBar from "../components/topBar";

export interface NavItem {
  title: string;
  href: string;
  baseHref: string;
  icon: React.ReactNode;
  pageNavItems?: {
    title: string;
    href: string;
  }[];
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      baseHref: "/dashboard",
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
      pageNavItems: [
        {
          title: "Products",
          href: "/dashboard/calendar/products",
        },
        {
          title: "Schedule",
          href: "/dashboard/calendar/schedule",
        },
        {
          title: "Settings",
          href: "/dashboard/calendar/settings",
        },
      ],
    },
    {
      title: "My Bookings",
      href: "/dashboard/bookings/upcoming",
      baseHref: "/dashboard/bookings",
      icon: <CalendarCheck size={20} />,
      pageNavItems: [
        {
          title: "Upcoming",
          href: "/dashboard/bookings/upcoming",
        },
        {
          title: "Completed",
          href: "/dashboard/bookings/completed",
        },
      ],
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
      <div className="flex flex-col md:pl-64 md:h-screen pb-20 md:pb-0 w-full ">
        <div className="fixed top-0 w-full z-10 bg-background overflow-hidden">
          <TopBar items={navItems} className="mx-4 md:mx-8" />
          <Separator className="mt-4" orientation="horizontal" />
        </div>
        <div>{children}</div>
      </div>
      <div className="md:hidden w-full">
        <BottomBar items={navItems} />
      </div>
    </div>
  );
}
