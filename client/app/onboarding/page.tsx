"use client";

import { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Stepper from "./Stepper";
import { Card } from "@/components/ui/card";

export default function ProfileForm() {
  const [stepUser, setStepUser] = useState(1);

  return (
    <div className="flex h-screen justify-center items-center">
      <Card className="md:w-1/3 flex justify-center">
        <div className="flex h-auto w-full">
          {/* Left Section */}
          <div className="flex-1 bg-background p-10 flex flex-col justify-center items-center w-full rounded-l-lg md:w-2/3">
            <h1 className="text-3xl font-bold mt-12">klipp</h1>
            <div className="py-5 w-full flex justify-center m-4">
              <Stepper passedactiveStep={stepUser} />
            </div>
            {/* Conditionally render Step1 or Step2 based on the "step" query parameter */}
            <div className="h-full w-full flex justify-center">
              {stepUser === 2 ? (
                <Step2 />
              ) : (
                <Step1 onFormSubmitSuccess={() => setStepUser(2)} />
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
