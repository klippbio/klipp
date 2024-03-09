"use client";
import Link from "next/link";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import LogoText from "../utils/logoText.png";
import { useAuthDetails } from "@/app/components/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Menu } from "lucide-react";
const Navbar = () => {
  const navigation = [
    "Product",
    "Features",
    "Pricing",
    "FAQs",
    "Earnings Calculator",
  ];
  const authDetails = useAuthDetails();

  return (
    <div className="w-full md:px-14 p-8 px-0 ">
      <nav className="container relative flex items-center justify-between mx-auto lg:justify-between xl:px-0">
        {/* Logo  */}
        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex flex-wrap items-center justify-between w-full lg:w-auto">
                <Link href="/">
                  <span className="flex items-center space-x-2 text-2xl font-medium text-indigo-500 dark:text-gray-100">
                    <span>
                      <Image src={LogoText} alt="N" width="120" />
                    </span>
                  </span>
                </Link>
                {/* 
                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="px-2 py-1 ml-auto text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700"
                >
                  <svg
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    {open && (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                      />
                    )}
                    {!open && (
                      <path
                        fillRule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                      />
                    )}
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="flex flex-wrap w-full my-5 lg:hidden">
                  <>
                    <div className="flex w-full gap-4 items-center mt-4 text-center">
                      <Link
                        href="/app/login"
                        className="px-6 w-1/2 py-2 text-primary border-2 rounded-md md:ml-5"
                      >
                        Login
                      </Link>

                      <Link
                        href="/app/signup"
                        className="px-6 w-1/2 py-2 text-white bg-primary rounded-md md:ml-5"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </>
                </Disclosure.Panel> */}
              </div>
            </>
          )}
        </Disclosure>

        {/* menu  */}
        {/* <div className="hidden text-center lg:flex lg:items-center">
          <ul className="items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
            {navigation.map((menu, index) => (
              <li className="mr-3 nav__item" key={index}>
                <Link
                  href="/"
                  className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800"
                >
                  {menu}
                </Link>
              </li>
            ))}
          </ul>
        </div> */}

        <div className="flex items-center">
          {authDetails.token ? (
            <div className="flex nav__item">
              <Link
                href="/dashboard"
                className="px-6 py-2 text-white bg-purple-600 hover:bg-purple-400 rounded-md md:ml-5"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <>
              <div className="">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex flex-col items-center">
                      <Menu size={28} />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Button
                        className="bg-purple-600 hover:bg-purple-500"
                        asChild
                      >
                        <Link href="/sign-in" className="w-24">
                          Login
                        </Link>
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {" "}
                      <Button
                        className="hover:text-purple-600 hover:bg-purple-100"
                        variant={"outline"}
                        asChild
                      >
                        <Link href="/sign-up" className="w-24">
                          Sign Up
                        </Link>
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="hidden md:flex items-center ">
                <div className="flex nav__item m-2">
                  <Button className="bg-purple-600 hover:bg-purple-500" asChild>
                    <Link href="/sign-in" className="w-24">
                      Login
                    </Link>
                  </Button>
                </div>
                <div className="flex nav__item m-2">
                  <Button
                    className="hover:text-purple-600 hover:bg-purple-100"
                    variant={"outline"}
                    asChild
                  >
                    <Link href="/sign-up" className="w-24">
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
