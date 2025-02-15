"use client";
import React, { useState } from "react";

function Profile() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex w-full gap-6  px-4 flex-col">
      <div className="flex flex-1 flex-col md:flex-row  gap-8 w-full items-center">
        <div className="max-md:flex max-md:justify-center ">
          <div className="rounded-full h-20 w-20 bg-slate-500 mb-2 sm:mb-0 sm:mr-4 flex items-center justify-center"></div>
        </div>
        <div className="flex flex-col flex-1 w-full  ">
          <div className="font-bold">userName</div>
          <div>
            <input
              type="text"
              className="w-full px-4 py-3 outline-none rounded-3xl placeholder:text-gray-500 bg-[#F6F0EA]"
              placeholder="username"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between">
        <div className="text-primary flex flex-col gap-1 items-start">
          <div className="text-primary text-lg font-bold">SMS Notification</div>
          <div className="font-extralight text-sm">Receive Updates Via Sms</div>
        </div>
        <div className="text-primary">
          <input type="checkbox" />
        </div>
      </div>

      <div className="flex flex-row items-center justify-between">
        <div className="text-primary flex flex-col gap-1 items-start">
          <div className="text-primary text-lg font-bold">
            Email Notification
          </div>
          <div className="font-extralight text-sm">
            Receive Updates Via Email
          </div>
        </div>
        <div className="text-primary">
          <input type="checkbox" />
        </div>
      </div>

      <hr className="bg-tertiary hidden md:block md:h-0" />
      <div className="font-bold text-2xl">Account Information</div>
      <div className="flex gap-5 flex-col md:flex-row w-full">
        <div className="flex  md:w-1/2 flex-col items-start">
          <div>Email</div>

          <input
            type="text"
            className="w-full px-4 py-3 outline-none rounded-3xl placeholder:text-gray-500 bg-[#F6F0EA]"
            placeholder="email@example.com"
          />
        </div>
        <div className="flex md:w-1/2 flex-col items-start">
          <div>Password</div>

          <input
            type="password"
            className="w-full px-4 py-3 outline-none rounded-3xl placeholder:text-gray-500 bg-[#F6F0EA]"
            placeholder="*******"
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-start">
        <div>Phone Number</div>

        <input
          type="text"
          className="w-full px-4 py-3 outline-none rounded-3xl placeholder:text-gray-500 bg-[#F6F0EA]"
          placeholder="+1234567890"
        />
      </div>

      <div className="flex w-full flex-col items-start">
        <div>Language</div>

        <input
          type="text"
          className="w-full px-4 py-3 outline-none rounded-3xl placeholder:text-gray-500 bg-[#F6F0EA]"
          placeholder="Select Your Language"
        />
      </div>

      <hr className="bg-tertiary hidden md:block md:h-0" />
      <div className="flex flex-row gap-5">
        <div className="py-1 px-3 rounded-xl bg-[#f7dbbf] text-primary border border-gray-300">
          Save Changes
        </div>

        <div className="py-1 px-3 rounded-xl bg-[#f7dbbf] text-primary border border-gray-300">
          Cancel
        </div>
      </div>
    </div>
  );
}

export default Profile;
