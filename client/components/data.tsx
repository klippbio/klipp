"use client";
import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
  FolderArrowDownIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../public/img/benefit-one.png";
import benefitTwoImg from "../public/img/benefit-two.png";
import { CalendarCheck, Link } from "lucide-react";

const benefitOne = {
  title: "All Your Tools, One Platform",
  desc: "Designed for modern creators, mentors, and digital entrepreneurs, we provide everything you need to effortlessly monetize your expertise and products.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Digital Product",
      desc: "Sell your ebooks, courses, videos, and more in a digital storefront customized to your brand. Instant setup, immediate impact.",
      icon: <FolderArrowDownIcon />,
    },
    {
      title: "Schedule Bookings and Sessions",
      desc: "With our built-in scheduling tool, offer your time for coaching or mentoring sessions, allowing clients to book directly at their convenience.",
      icon: <CalendarCheck />,
    },
    {
      title: "Link in Bio",
      desc: "Beyond just a digital store, incorporate all your essential links in one place.",
      icon: <Link />,
    },
  ],
};

const benefitTwo = {
  title: "All Your Tools, One Platform",
  desc: "You can use this same layout with a flip image to highlight your rest of the benefits of your product. It can also contain an image or Illustration as above section along with some bullet points.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Mobile Responsive Template",
      desc: "Nextly is designed as a mobile first responsive template.",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Powered by Next.js & TailwindCSS",
      desc: "This template is powered by latest technologies and tools.",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "Dark & Light Mode",
      desc: "Nextly comes with a zero-config light & dark mode. ",
      icon: <SunIcon />,
    },
  ],
};

export { benefitOne, benefitTwo };
