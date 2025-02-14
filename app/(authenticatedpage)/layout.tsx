import React from "react";
import { ReactNode } from "react";
interface RootLayoutProps {
  children: ReactNode;
}
function layout({ children }: RootLayoutProps) {
  return (
    <div className="flex w-full mb-10 flex-col md:flex-row gap-6  px-5">
      <div className="hidden  md:block   flex-col md:gap-4 items-center ">
        <div className=" flex px-6 w-full  flex-row gap-3 py-1  mb-6 rounded-lg bg-[#f7e2ce]  text-red-500 font-bold">
          {" "}
          <div className="w-1/4">🔎</div>
          <div className="w-3/4">Profile</div>
        </div>
        <div className=" py-1 rounded bg-ter text-center text-black font-bold">
          {" "}
          Profile
        </div>
      </div>
      <div className="md:w-3/4">{children}</div>
    </div>
  );
}

export default layout;
