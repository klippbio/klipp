"use client";
import Image from "next/image";
import Container from "./container";
import heroImg from "../public/img/hero4.png";

const Hero = () => {
  return (
    <>
      <Container className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl mb-2 font-medium leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Turn{" "}
              <span className="font-extrabold bg-gradient-to-r from-purple-600 via-blue-500 to-purple-400 inline-block text-transparent bg-clip-text">
                {" "}
                Passion into Profit
              </span>
              <br />
              with your Digital Store
              <br />
            </h1>
            <p className="py-10 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
              Sell digital products, schedule meetings, offer coaching, and
              consolidate links in your link-in-bio store. Your one-stop
              monetization platform.
            </p>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <a
                href={process.env.NEXT_PUBLIC_FRONTEND_URL + "/sign-up"}
                target="_blank"
                rel="noopener"
                className="px-8 py-4 text-lg font-medium text-center text-white bg-indigo-600 rounded-md "
              >
                Launch your store
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={heroImg}
              width="616"
              height="617"
              className={"object-cover"}
              alt="Hero Illustration"
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Hero;
