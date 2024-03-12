interface CalendarLayoutProps {
  children: React.ReactNode;
}

export default function CalendarLayout({ children }: CalendarLayoutProps) {
  return (
    <div className="h-full pt-36 px-4 md:px-8 overflow-hidden ">{children}</div>
  );
}
