interface DigitalDownloadsLayoutProps {
  children: React.ReactNode;
}

export default function DigitalDownloadsLayout({
  children,
}: DigitalDownloadsLayoutProps) {
  return (
    <div className="h-full w-full pt-4 px-4 md:px-8 pb-10 overflow-y-auto">
      {children}
    </div>
  );
}
