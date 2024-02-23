import TopBar from "@/app/components/topBar";
import { Separator } from "@/components/ui/separator";

export default function SaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <div className="sticky top-0 z-50 bg-background ">
        <TopBar pageTitle="Sales" className="mx-4 md:mx-8" />
        <Separator className="mt-4" orientation="horizontal" />
      </div>
      <div className="mx-4 md:mx-8 mt-4 pb-20 md:pb-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
