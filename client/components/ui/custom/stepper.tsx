"use client";

import { useState, useEffect } from "react";

type Prop = {
  passedactiveStep: number;
};

const Stepper = ({ passedactiveStep }: Prop) => {
  const [activeStep, setActiveStep] = useState(passedactiveStep);

  useEffect(() => {
    setActiveStep(passedactiveStep);
  }, [passedactiveStep]);

  const calculateLineColor = (stepIndex: number) => {
    return activeStep >= stepIndex ? "bg-black" : "bg-gray-300";
  };

  return (
    <div>
      <div className="w-full flex items-center">
        <div
          className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 ${
            activeStep >= 1
              ? "bg-black text-white border-black"
              : "border-gray-300"
          }`}
        >
          1
        </div>
        <div
          className={`w-20 h-px transition-all duration-500 ${calculateLineColor(
            1
          )}`}
        />
        <div
          className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 ${
            activeStep >= 2
              ? "bg-black text-white border-black"
              : "border-gray-300"
          }`}
        >
          2
        </div>
        <div
          className={`w-20 h-px transition-all duration-500 ${calculateLineColor(
            2
          )}`}
        />
        <div
          className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 ${
            activeStep >= 3
              ? "bg-black text-white border-black"
              : "border-gray-300"
          }`}
        >
          3
        </div>
      </div>
    </div>
  );
};

export default Stepper;
