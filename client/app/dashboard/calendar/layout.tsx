import TopBar from "@/app/components/topBar";
import { Separator } from "@/components/ui/separator";
interface CalendarLayoutProps {
  children: React.ReactNode;
}

const navItems = [
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
];

export default function CalendarLayout({ children }: CalendarLayoutProps) {
  return (
    <div className="h-full">
      <div className="sticky top-0 z-50 bg-background ">
        <TopBar
          pageTitle="Calendar"
          navItems={navItems}
          className="mx-4 md:mx-8"
        />
        <Separator className="mt-4" orientation="horizontal" />
      </div>
      <div className="mx-4 md:mx-8 mt-4 mb-4 pb-20 md:pb-0 overflow-auto">
        {children}
      </div>
    </div>
  );
}
