"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
interface RootState {
  language: {
    translations: {
      contact: {
        "aboutUs": string;
        "aboutSub": string;
        "sampleText": string;
        
      };
    };
  };
}

const ContactUs = () => {
  const translations = useSelector(
    (state: RootState) => state.language.translations
  );
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full md:px-20 md:py-10">
      <div className="self-center h-[450px] w-full relative">
        <Image
          src={"/images/Artboard.png"}
          alt="About Image"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="mt-3">
        <h1 className="text-3xl font-bold text-primary mb-8 md:ml-10">
          {translations.contact.aboutUs}
        </h1>
        <div className="font-reem text-md text-primary md:ml-10">
          {translations.contact.aboutSub}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
