import Image from "next/image";
import React from "react";
import img from "../public/img/landscape_img_1.png";
import ava from "../public/img/ava.png";
import liam from "../public/img/liam.png";

function Creators() {
  return (
    <div className="w-full p-4 bg-secondary-foreground">
      <div>
        <div className="flex items-center justify-center">
          <span className="mt-6 text-white text-5xl">
            Profiles on <b>klipp</b>
          </span>
        </div>
        <div className="p-16 mb-20 flex md:gap-0 gap-10  md:justify-between m-6 overflow-auto">
          <Image
            className="rounded-xl hidden md:block shadow-lg border-2"
            src={img}
            width="900"
            height="450"
            alt="Creators using klipp"
          />

          <Image
            className="rounded-xl shadow-lg border-2"
            src={liam}
            width="300"
            height="450"
            alt="Creators using klipp"
          />
          <Image
            className="rounded-xl shadow-lg border-2"
            src={ava}
            width="300"
            height="450"
            alt="Creators using klipp"
          />
        </div>
      </div>
    </div>
  );
}

export default Creators;
