declare module "admin" {
  export interface NavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
      href: string;
      baseHref: string;
      title: string;
      icon: React.ReactNode;
    }[];
  }
}
