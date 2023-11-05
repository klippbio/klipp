interface CalendarLayoutProps {
  children: React.ReactNode;
}

export default function CalendarLayout({ children }: CalendarLayoutProps) {
  return <section>{children}</section>;
}
