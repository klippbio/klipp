import TopBar from "@/app/components/topBar";
import { Separator } from "@/components/ui/separator";
interface CalendarLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    title: "Products",
    href: "/calendar/products",
  },
  {
    title: "Schedule",
    href: "/calendar/schedule",
  },
  {
    title: "Settings",
    href: "/calendar/settings",
  },
];

export default function CalendarLayout({ children }: CalendarLayoutProps) {
  return (
    <div className="h-full relative">
      <div className="sticky top-0 z-50 bg-background ">
        <TopBar
          pageTitle="Calendar"
          navItems={navItems}
          className="mx-4 md:mx-8"
        />
        <Separator className="mt-4" orientation="horizontal" />
      </div>
      <div className="mx-4 md:mx-8 mt-4 mb-4 overflow-y-">{children}</div>
    </div>
  );
}
