"use client";

import { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Stepper from "./Stepper";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import logoText from "./../../utils/logoText.png";

export default function ProfileForm() {
  const [stepUser, setStepUser] = useState(1);

  return (
    <div className="h-svh md:h-screen w-screen">
      <div className="flex flex-col h-full w-full justify-center items-center overflow-y-auto">
        <Card className="md:w-1/3 my-8 mx-4 flex justify-center">
          <div className="bg-background p-5 flex flex-col justify-center items-center w-full rounded-l-lg">
            <Image
              src={logoText}
              alt="logoWithText"
              width={100}
              priority={true}
            />
            <div className="py-5 w-full flex justify-center m-4">
              <Stepper passedactiveStep={stepUser} />
            </div>
            <div className="h-full w-full flex justify-center">
              {stepUser === 2 ? (
                <Step2 />
              ) : (
                <Step1 onFormSubmitSuccess={() => setStepUser(2)} />
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
