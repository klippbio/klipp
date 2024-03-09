"use client";
import Image from "next/image";
import Container from "./container";
import heroImg from "../public/img/hero4.png";

const Hero = () => {
  return (
    <>
      <Container className="flex flex-wrap p-0 ">
        <div className="flex items-center mt-16 justify-center w-full">
          <div className=" md:mb-44 mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-4xl xl:text-6xl word-spacing-widest tracking-normal font-semibold mb-2 text-center leading-snug text-gray-800 lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Turn{" "}
              <span className="font-extrabold bg-gradient-to-r from-purple-600 via-blue-500 to-purple-400 inline-block text-transparent bg-clip-text">
                {" "}
                Passion into Profit
              </span>
              <br />
              with your Digital Store
              <br />
            </h1>

            <p className="md:w-2/3 text-lg mx-auto my-auto text-center py-8 md:text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              Sell digital products, schedule meetings, offer coaching, and
              consolidate links in your link-in-bio store.{" "}
              <span className="hidden md:block whitespace-nowrap">
                {" "}
                Your one-stop monetization platform.
              </span>
            </p>

            <div className="mt-3 text-center space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <a
                href={process.env.NEXT_PUBLIC_FRONTEND_URL + "/sign-up"}
                target="_blank"
                rel="noopener"
                className="px-8 py-4 text-lg font-medium text-center text-white bg-purple-600 hover:bg-purple-500 rounded-md "
              >
                Launch your store
              </a>
            </div>
          </div>
        </div>

        {/* <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={heroImg}
              width="616"
              height="617"
              className={"object-cover"}
              alt="Hero Illustration"
            />
          </div>
        </div> */}
      </Container>
    </>
  );
};

export default Hero;
