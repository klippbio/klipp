// "use client";

// import { useState, useEffect } from "react";

// type Prop = {
//   passedactiveStep: number;
// };

// const Stepper = ({ passedactiveStep }: Prop) => {
//   const [activeStep, setActiveStep] = useState(passedactiveStep);

//   useEffect(() => {
//     setActiveStep(passedactiveStep);
//   }, [passedactiveStep]);

//   const calculateLineColor = (stepIndex: number) => {
//     return activeStep >= stepIndex ? "bg-black" : "bg-gray-300";
//   };

//   return (
//     <div>
//       <div className="w-full flex items-center">
//         <div
//           className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 ${
//             activeStep >= 1
//               ? "bg-black text-white border-black"
//               : "border-gray-300"
//           }`}
//         >
//           1
//         </div>
//         <div
//           className={`w-20 h-px transition-all duration-500 ${calculateLineColor(
//             1
//           )}`}
//         />
//         <div
//           className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 ${
//             activeStep >= 2
//               ? "bg-black text-white border-black"
//               : "border-gray-300"
//           }`}
//         >
//           2
//         </div>
//         <div
//           className={`w-20 h-px transition-all duration-500 ${calculateLineColor(
//             2
//           )}`}
//         />
//         <div
//           className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 ${
//             activeStep >= 3
//               ? "bg-black text-white border-black"
//               : "border-gray-300"
//           }`}
//         >
//           3
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Stepper;

import { useState, useEffect } from "react";

type Prop = {
  totalSteps: number;
  currentStep: number;
};

const Stepper = ({ totalSteps, currentStep }: Prop) => {
  const [activeStep, setActiveStep] = useState(currentStep);

  useEffect(() => {
    setActiveStep(currentStep);
  }, [currentStep]);

  const calculateLineColor = (stepIndex: number) => {
    return activeStep > stepIndex ? "bg-black" : "bg-gray-300";
  };

  const renderSteps = () => {
    const steps = [];
    for (let i = 1; i <= totalSteps; i++) {
      steps.push(
        <div key={i} className="flex items-center">
          <div
            className={`relative w-8 h-8 flex items-center justify-center rounded-full border-2 ${
              activeStep >= i
                ? "bg-black text-white border-black"
                : "border-gray-300"
            }`}
          >
            {i}
          </div>
          {i < totalSteps && (
            <div
              key={`line-${i}`}
              className={`h-px w-20 transition-all duration-500 ${calculateLineColor(
                i
              )}`}
            />
          )}
        </div>
      );
    }
    return steps;
  };

  return <div className="flex">{renderSteps()}</div>;
};

export default Stepper;
