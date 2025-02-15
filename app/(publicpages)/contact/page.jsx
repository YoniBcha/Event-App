"use client";

import { Icon } from "@iconify/react";
import React from "react";
import Image from "next/image";

const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">
        CONTACT US
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="">
          <div className="mb-8">
            <h2 className="text-xl text-[#7f7f7f] font-semibold">Call Us</h2>
            <p className="text-[#7f7f7f] font-regular mt-1">
              Call our team Mon-Fri from 8am to 5pm.
            </p>
            <div className="flex gap-2 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  fill="#c9a08a"
                  d="m16.052 1.787l.966.261a7 7 0 0 1 4.93 4.934l.26.965l-1.93.521l-.261-.965a5 5 0 0 0-3.522-3.524l-.965-.262zM1 2h8.58l1.487 6.69l-1.86 1.86a14.1 14.1 0 0 0 4.243 4.242l1.86-1.859L22 14.42V23h-1a19.9 19.9 0 0 1-10.85-3.196a20.1 20.1 0 0 1-5.954-5.954A19.9 19.9 0 0 1 1 3zm2.027 2a17.9 17.9 0 0 0 2.849 8.764a18.1 18.1 0 0 0 5.36 5.36A17.9 17.9 0 0 0 20 20.973v-4.949l-4.053-.9l-2.174 2.175l-.663-.377a16.07 16.07 0 0 1-6.032-6.032l-.377-.663l2.175-2.174L7.976 4zm12.111 1.165l.966.261a3.5 3.5 0 0 1 2.465 2.467l.26.965l-1.93.521l-.261-.965a1.5 1.5 0 0 0-1.057-1.057l-.965-.261z"
                  strokeWidth="0.5"
                  stroke="#c9a08a"
                />
              </svg>
              <p className="text-primary font-medium">+966 50 065 9305</p>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl text-[#7f7f7f] font-semibold">
              Chat With Us
            </h2>
            <p className="text-[#7f7f7f] font-regular mt-1">
              Speak to our friendly team via live chat.
            </p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 relative">
                  <Image
                    src={"/images/phone.png"}
                    alt="Phone Icon"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <p className="text-primary underline text-lg">
                  Start a live chat
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                  className="-ml-1"
                >
                  <rect width="48" height="48" fill="none" />
                  <path
                    fill="none"
                    stroke="#c9a08a"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.5 13c13.687 13.574 14.825 13.09 29 0"
                    stroke-width="1"
                  />
                  <rect
                    width="37"
                    height="31"
                    x="5.5"
                    y="8.5"
                    fill="none"
                    stroke="#c9a08a"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    rx="4"
                    ry="4"
                    stroke-width="1"
                  />
                </svg>
                <p className="text-primary underline text-lg">
                  Shoot us an email{" "}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="-ml-1"
                >
                  <rect width="24" height="24" fill="none" />
                  <path
                    fill="#c9a08a"
                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                    stroke-width="0.5"
                    stroke="#c9a08a"
                  />
                </svg>
                <p className="text-primary underline text-lg">
                  Message us on Instagram{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="">
            <h2 className="text-xl text-[#7f7f7f] font-semibold">Visit Us </h2>
            <p className="text-[#7f7f7f] font-regular mt-1">
              Chat to us in person at our Saudi Arabia HQ.{" "}
            </p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  className="-ml-1"
                >
                  <rect width="21" height="21" fill="none" />
                  <g
                    fill="none"
                    fill-rule="evenodd"
                    stroke="#c9a08a"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    transform="translate(4 2)"
                    stroke-width="1"
                  >
                    <path d="m6.5 16.54l.631-.711Q8.205 14.6 9.064 13.49l.473-.624Q12.5 8.875 12.5 6.533C12.5 3.201 9.814.5 6.5.5s-6 2.701-6 6.033q0 2.342 2.963 6.334l.473.624a55 55 0 0 0 2.564 3.05" />
                    <circle cx="6.5" cy="6.5" r="2.5" />
                  </g>
                </svg>
                <p className="text-primary underline text-lg">Saudi Arabia </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <form className="space-y-2">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="border rounded-lg px-3 border-[#e0bfb8] w-full py-2 mt-1 focus:outline-none focus:ring-[#e0bfb8] focus:border-[#e0bfb8] bg-[#f7f4e9]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border rounded-lg px-3 border-[#e0bfb8] w-full py-2 mt-1 focus:outline-none focus:ring-[#e0bfb8] focus:border-[#e0bfb8] bg-[#f7f4e9]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className="border rounded-lg px-3 border-[#e0bfb8] w-full py-2 mt-1 focus:outline-none focus:ring-[#e0bfb8] focus:border-[#e0bfb8] bg-[#f7f4e9]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="2"
                className="border rounded-lg px-3 border-[#e0bfb8] w-full py-2 mt-1 focus:outline-none focus:ring-[#e0bfb8] focus:border-[#e0bfb8] bg-[#f7f4e9]"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#c2937b] text-white px-4 py-2  hover:bg-[#c2937b] transition rounded-full cursor-pointer"
            >
              SEND MESSAGE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
