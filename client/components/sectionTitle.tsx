"use client";
import React from "react";
import Container from "./container";

const SectionTitle = (props: any) => {
  return (
    <Container
      className={`flex w-full flex-col ${
        props.align === "left" ? "" : "items-center justify-center text-center"
      }`}
    >
      {props.pretitle && (
        <div className="text-sm font-bold tracking-wider  uppercase">
          {props.pretitle}
        </div>
      )}

      {props.title && (
        <h2 className="mt-3 mb-3 text-3xl font-bold leading-snug tracking-tight lg:leading-tight lg:text-4xl text-white">
          {props.title}
        </h2>
      )}

      {props.children && (
        <p className=" py-4 text-lg leading-normal text-gray-500 lg:text-xl xl:text-xl dark:text-gray-300">
          {props.children}
        </p>
      )}
    </Container>
  );
};

export default SectionTitle;
