import TopBar from "@/app/components/topBar";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    title: "Upcoming",
    href: "/app/bookings/upcoming",
  },
  {
    title: "Completed",
    href: "/app/bookings/completed",
  },
];

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      <div className="sticky top-0 z-50 bg-background ">
        <TopBar
          pageTitle="Bookings"
          className="mx-4 md:mx-8"
          navItems={navItems}
        />
        <Separator className="mt-4" orientation="horizontal" />
      </div>
      <div className="mx-4 md:mx-8 mt-4 pb-20 md:pb-0">{children}</div>
    </div>
  );
}
