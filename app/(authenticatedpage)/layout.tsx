import React from "react";
import { ReactNode } from "react";
interface RootLayoutProps {
  children: ReactNode;
}
function layout({ children }: RootLayoutProps) {
  return (
    <div className="flex w-full mb-10 gap-6 p-5">
      <div className="w-[20%] flex-col items-center">
        <div className="flex flex-col gap-5 bg-[#fbf4e8] rounded-sm m-4 px-5 py-3">
          <div className="flex gap-3 py-1 px-2 rounded text-primary hover:bg-primary hover:text-white font-bold">
            <div className="">🔎</div>
            <div className="">Profile</div>
          </div>
          <div className="flex gap-3 py-1 px-2 rounded text-primary hover:bg-primary hover:text-white font-bold">
            <div className="">🔎</div>
            <div className=" py-1 rounded text-primary hover:bg-primary hover:text-white font-bold">
              My Orders
            </div>{" "}
          </div>
        </div>
      </div>
      <div className="md:w-[80%]">{children}</div>
    </div>
  );
}

export default layout;
