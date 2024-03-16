// export default Hero;
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "./container";

// Import your images
import image1 from "/public/img/LImg1.png";
import image2 from "/public/img/LImg2.png";
import image3 from "/public/img/LImg3.png";
import image4 from "/public/img/RImg1.png";
import image5 from "/public/img/RImg2.png";
import image6 from "/public/img/RImg3.png";

//border border-l-0 border-r-0 border-purple-200 py-2 px-6 rounded-full bg-gradient-to-b from-purple-100 bg-white
const Hero = () => {
  return (
    <>
      <Container className="grid grid-cols-5 w-full h-[calc(100vh-64px)]">
        {/* Left Part - sliding up */}
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="hidden h-full pl-16 md:flex flex-col mt-64"
        >
          <Image src={image1} alt="Image 1" width="100" />
          <Image src={image2} alt="Image 2" width="300" height="300" />
          <Image src={image3} alt="Image 3" width="300" height="300" />
        </motion.div>

        {/* Center Part - fading in */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="col-span-6 md:col-span-3 flex items-center justify-center h-full"
        >
          <div className="md:mb-44 mb-32">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.75, type: "spring" }}
              className="flex items-center justify-center w-auto"
            >
              <span className="border  border-purple-200 py-2 px-6 rounded-full bg-purple-50">
                Best fit for modern creators and entrepreneurs
              </span>
            </motion.div>
            <h1 className="text-3xl md:text-6xl 2xl:text-7xl mt-5 word-spacing-widest tracking-normal font-semibold mb-2 text-center leading-snug text-gray-800 lg:leading-tight xl:leading-tight dark:text-white">
              Launch your digital store
              <br /> in{" "}
              <span className="font-extrabold bg-gradient-to-r from-purple-600 via-blue-500 to-purple-400 inline-block text-transparent bg-clip-text">
                {"<"}5 minutes
              </span>
            </h1>
            <p className="md:w-3/4 text-lg mx-auto my-auto text-center p-8 md:text-xl leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
              Sell digital products, schedule meetings, offer coaching, and
              consolidate links in your link-in-bio store.{" "}
              <span className="hidden md:block whitespace-nowrap">
                Your one-stop monetization platform.
              </span>
            </p>
            <div className="mt-8 text-center space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <a
                href={process.env.NEXT_PUBLIC_FRONTEND_URL + "/sign-up"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-lg font-medium text-center text-white bg-purple-600 hover:bg-purple-500 rounded-md"
              >
                <span>Create your store</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Part - sliding down */}
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="hidden h-full pr-16 md:flex items-end flex-col mt-24"
        >
          <Image src={image4} alt="Image 1" width="100" />
          <Image src={image5} alt="Image 2" width="300" height="300" />
          <Image src={image6} alt="Image 3" width="300" height="300" />
        </motion.div>
      </Container>
    </>
  );
};

export default Hero;
