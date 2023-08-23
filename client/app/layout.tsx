// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });
import QueryWrapper from "./components/QueryWrapper";
import { SideNav } from "./components/sideNav";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { usePathname } from "next/navigation";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "My Products",
    href: "/products",
  },
  {
    title: "Onboarding",
    href: "/onboarding",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const pathname = usePathname();
  // const [showNav, setShowMenu] = useState(true);
  // console.log(showNav);
  {
    /* // <div className="h-screen w-screen flex flex-col md:flex-row">
    //   <div className="md:w-1/6">
    //     <SidebarNav items={sidebarNavItems} />
    //   </div>
    //   <Separator orientation="vertical" className="hidden md:block" />
    //   <div className="md:w-5/6">
    //     <div className="bg-red-500 p-4 md:flex md:flex-col h-full">
    //       {children}
    //     </div>
    //   </div>
    // </div> */
  }
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
