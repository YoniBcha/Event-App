"use client";

import React, { useState } from "react";
import Link from "next/link";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const switchLanguage = (lang) => {
    setSelectedLang(lang);
  };

  return (
    <>
      <div className="flex w-full py-6 bg-transparent px-7 flex-row justify-between items-center text-sm text-primary">
        <div className="sm:hidden cursor-pointer" onClick={toggleDrawer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 16 16"
          >
            <rect width="16" height="16" fill="none" />
            <path
              fill="#C2937B"
              d="M15 4H1V2h14zm0 5H1V7h14zM1 14h14v-2H1z"
              strokeWidth="0.5"
              stroke="#C2937B"
            />
          </svg>
        </div>

        <div className="hidden sm:flex flex-row gap-4 items-center text-primary">
          <Link href={"/home"}>HOME</Link>
          <Link href={"/"}>DESIGNS</Link>
          <Link href={"/about"}>ABOUT</Link>
          <Link href={"/contact"}>CONTACT</Link>
          <Link href={"/mainpage"}>BOOKING</Link>
        </div>

        <div className="border p-2 border-primary rounded-sm">FENZO</div>

        <div className="flex items-center">
          <div
            className={`flex justify-center items-center h-6 w-6 rounded-sm cursor-pointer ${
              selectedLang === "EN"
                ? "bg-primary text-white"
                : "border border-primary text-primary"
            }`}
            onClick={() => switchLanguage("EN")}
          >
            EN
          </div>
          <div
            className={`flex justify-center items-center h-6 w-6 rounded-sm cursor-pointer pb-2 ${
              selectedLang === "AR"
                ? "bg-primary text-white"
                : "border border-primary text-primary"
            }`}
            onClick={() => switchLanguage("AR")}
          >
            ع
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-500 ml-4"></div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeDrawer}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-lg z-50 transform pt-10 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button
          className="absolute top-4 right-4 text-xl text-primary"
          onClick={toggleDrawer}
        >
          ✖
        </button>

        <nav className="flex flex-col p-6 space-y-4 text-md text-primary">
          <Link href="/home" onClick={toggleDrawer}>
            HOME
          </Link>
          <Link href="#" onClick={toggleDrawer}>
            DESIGNS
          </Link>
          <Link href="/about" onClick={toggleDrawer}>
            ABOUT
          </Link>
          <Link href="/contact" onClick={toggleDrawer}>
            CONTACT
          </Link>
          <Link href="/booking" onClick={toggleDrawer}>
            BOOKING
          </Link>
        </nav>
      </div>
    </>
  );
}

export default Header;
