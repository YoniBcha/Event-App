/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useSelector } from "react-redux";

const Home: React.FC = () => {
  // const currentLocale = useSelector(
  //   (state: any) => state.language.currentLocale
  // );
  const translations = useSelector((state: any) => state.language.translations);
  return (
    <div className="h-full w-full flex flex-col md:flex-row">
      <div className="w-full md:hidden flex gap-2 justify-evenly">
        <div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/images/Rectangle 2202.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/images/Rectangle 220.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/images/recr.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      <div className="w-full mt-5 md:w-1/2 flex flex-col gap-3 text-start items-start md:justify-center">
        <div className="text-start">{translations.welcome}</div>
        <div className="text-5xl text-primary max-sm:text-3xl font-bold">FENZO</div>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro odio
          quam accusantium rerum provident pariatur odit officia voluptatibus
          vitae aliquid molestiae ea laudantium qui, atque necessitatibus
          voluptate possimus nam neque!
        </div>
        <button className="p-2 text-gray-100 bg-primary hover:bg-[#faebdc] hover:text-primary rounded">
          {translations.startJourney}
        </button>
      </div>

      <div className="w-1/2 sm:hidden md:flex flex-row gap-2 mx-3 justify-evenly">
        <div
          className="w-1/3"
          style={{
            backgroundImage: "url('/images/Rectangle 2202.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          className="w-1/3"
          style={{
            backgroundImage: "url('/images/Rectangle 220.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          className="w-1/3"
          style={{
            backgroundImage: "url('/images/recr.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Home;
