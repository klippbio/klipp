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

import benefitOneImg from "../public/img/benefits.png";
import benefitTwoImg from "../public/img/step1.png";
import benefitThreeImg from "../public/img/meet.png";
import { CalendarCheck, Link } from "lucide-react";
import benefitFourImg from "../public/img/landscape_img_1.png";
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

const stepOne = {
  pretitle: "Step 1. ",
  title: "Create your link-in-bio store in 5 minutes.",
  desc: "Get started in just 3 minutes with our user-friendly setup. Creating your klipp store is simple and completely free.",
  image: benefitTwoImg,
  bgColor: "bg-[#e5f3f3]",
};

const stepTwo = {
  pretitle: "Step 2.",
  title: "Get Your Products Live",
  desc: "Set up your first product be it Digital Download, Coaching/Mentoring Session or External Link in no time. ",
  image: benefitThreeImg,
  bgColor: "bg-[#fcf2d6]",
};

const stepThree = {
  pretitle: "Step 3 . ",
  title: "Promote Your Shop & Start Selling",
  desc: "Keep track of sales and schedules easily. Great for your social media bios.",
  image: benefitFourImg,
  bgColor: "bg-[#fff1f9]",
};

export { benefitOne, stepTwo, stepOne, stepThree };
