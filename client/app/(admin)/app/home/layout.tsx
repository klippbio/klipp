import TopBar from "@/app/components/topBar";
import { Separator } from "@/components/ui/separator";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="h-screen relative">
      <div className="sticky top-0 z-50 bg-background ">
        <TopBar pageTitle="Home" className="mx-4 md:mx-8" />
        <Separator className="mt-4" orientation="horizontal" />
      </div>
      <div className="mx-4 md:mx-8 mt-4">{children}</div>
    </div>
  );
}
