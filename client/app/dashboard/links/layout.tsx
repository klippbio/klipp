interface DigitalDownloadsLayoutProps {
  children: React.ReactNode;
}

export default function DigitalDownloadsLayout({
  children,
}: DigitalDownloadsLayoutProps) {
  return (
    <div className="h-full pt-24 px-4 md:px-8 overflow-hidden ">{children}</div>
  );
}
