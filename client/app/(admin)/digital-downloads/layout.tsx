import Image from "next/image";

interface DigitalDownloadsLayoutProps {
  children: React.ReactNode;
}

export default function CalendarLayout({
  children,
}: DigitalDownloadsLayoutProps) {
  return <section>{children}</section>;
}
