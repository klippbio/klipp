import TopBar from "@/app/components/topBar";
import { Separator } from "@/components/ui/separator";

interface DigitalDownloadsLayoutProps {
  children: React.ReactNode;
}

export default function DigitalDownloadsLayout({
  children,
}: DigitalDownloadsLayoutProps) {
  return (
    <div className="h-full relative">
      <div className="sticky top-0 z-50 bg-background ">
        <TopBar pageTitle="Stripe" className="mx-4 md:mx-8" />
        <Separator className="mt-4" orientation="horizontal" />
      </div>
      <div className="mx-4 md:mx-8 mt-4">{children}</div>
    </div>
  );
}
