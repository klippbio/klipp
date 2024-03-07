"use client";
import Image from "next/image";
import React from "react";
import Container from "./container";

const Steps = (props: any) => {
  const { data } = props;
  const bgColor = data.bgColor;
  return (
    <>
      <Container className="flex flex-wrap mb-20 lg:gap-10 lg:flex-nowrap ">
        <div
          className={`flex items-center justify-center w-full lg:w-1/2 ${
            props.imgPos === "right" ? "lg:order-1" : ""
          }`}
        >
          <div
            className={`md:p-14 p-5 ${bgColor} mt-8 mr-6 shadow-xl rounded-2xl`}
          >
            <Image
              src={data.image}
              width="521"
              alt="Benefits"
              className={"object-cover shadow-xl rounded-2xl"}
              placeholder="blur"
              blurDataURL={data.image.src}
            />
          </div>
        </div>

        <div
          className={`flex flex-wrap items-center w-full lg:w-1/2 ${
            data.imgPos === "right" ? "lg:justify-end" : ""
          }`}
        >
          <div>
            <div className="flex flex-col w-full mt-4">
              <h6 className="text-xl font-semibold text-gray-500 uppercase dark:text-gray-300">
                {data.pretitle}
              </h6>
              <h3 className="max-w-2xl mt-3 text-3xl font-bold leading-snug tracking-tight text-gray-800 lg:leading-tight lg:text-4xl dark:text-white">
                {data.title}
              </h3>

              <p className="max-w-2xl py-4 text-lg leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
                {data.desc}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Steps;
