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
        "commercialNo": string;
        "commercialTitle": string;
      };
    };
  };
}

const ContactUs = () => {
  const translations = useSelector(
    (state: RootState) => state.language.translations
  );
  const aboutImages = [
    "/images/pic3.jpg",
    "/images/pic4.jpg",
    "/images/pic1.jpg",
    "/images/pic2.jpg"
  ];
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:px-2">
        <div className="self-center h-[14rem] md:h-[24rem] w-full relative">
          <Image
            src={"/images/Artboard.png"}
            alt="About Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="mt-3">
          <h1 className="text-3xl font-bold text-center text-primary">
            {translations.contact.aboutUs}
          </h1>
          <div className="font-reem text-md text-black">
            {translations.contact.aboutSub.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
        <div>
        </div>
      </div>
      <div className="bg-secondary p-6 text-black mb-4 flex justify-between sm:w-[60%] w-full mx-auto flex-row max-[300px]:flex-col gap-4">
        <p className="font-bold">
        {translations.contact.commercialNo}
        </p>
        <p>
        {translations.contact.commercialTitle}
        </p>
      </div>
        <div className="grid grid-cols-1 mx-auto sm:w-[75%]  min-[300px]:grid-cols-2 sm:gap-6 pt-3 gap-4 w-full sm:px-4">
            {aboutImages.map((img, idx) => (
              <div key={idx} className="relative w-full h-40">
                <Image
            src={img}
            alt={`About grid image ${idx + 1}`}
            layout="fill"
            objectFit="cover"
                />
              </div>
            ))}
          </div>
    </div>
  );
};

export default ContactUs;
