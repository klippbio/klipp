"use client";
import React from "react";

const Container = (props: any) => {
  return (
    <div className={`p-0 xl:px-0 ${props.className ? props.className : ""}`}>
      {props.children}
    </div>
  );
};

export default Container;
