"use client";

import React from "react";
import Image from "next/image";

const ContactUs = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full md:px-20 md:py-10">
      <div className="self-center h-[450px] w-full relative">
        <Image
          src={"/images/about.png"}
          alt="About Image"
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="mt-3">
        <h1 className="text-3xl font-bold text-primary mb-8 md:ml-10">
          About Us
        </h1>
        <div className="font-reem text-md text-primary md:ml-10">
          Welcome to FENZO, where dreams come to life and love takes center
          stage. Our journey began with a passion for creating unforgettable
          moments, turning ordinary events into extraordinary celebrations. At
          FENZO, we believe in the power of love and the magic it brings to
          every union. With a team of dedicated professionals, we are committed
          to making your wedding day an enchanting experience that reflects your
          unique love story. Imagine the wedding day you’ve always dreamed of –
          an exquisite symphony of luxury and elegance.
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
