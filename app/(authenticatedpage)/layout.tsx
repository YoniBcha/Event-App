/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
interface AuthState {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  notifications: any[];
  csrf_token: string;
}

interface RootState {
  auth: AuthState;
}

interface RootLayoutProps {
  children: ReactNode;
}

function Layout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row w-full mb-10 gap-2 md:gap-6">
      <div className="w-full md:w-[20%] flex-col items-center">
        <div className="flex flex-col gap-5 bg-[#fbf4e8] rounded-sm m-4 p-2">
          <Link
            href="/sidebar/profile"
            className={`flex gap-3 py-1 px-2 rounded text-primary hover:bg-primary hover:text-white font-bold ${
              pathname === "/sidebar/profile" ? "bg-primary text-white" : ""
            }`}
          >
            <div>
              <Image
                src={"/zip/setting-01.svg"}
                width={18}
                height={18}
                alt="contact"
              />
            </div>
            <div>Profile</div>
          </Link>

          <Link
            href="/sidebar/my-orders"
            className={`flex gap-3 py-1 px-2 rounded text-primary hover:bg-primary hover:text-white font-bold ${
              pathname === "/sidebar/my-orders" ? "bg-primary text-white" : ""
            }`}
          >
            <div>
              <Image
                src={"/zip/file-02.svg"}
                width={18}
                height={18}
                alt="contact"
              />
            </div>
            <div>My Orders</div>
          </Link>
        </div>
      </div>

      <div className="md:w-[80%]">{children}</div>
    </div>
  );
}

export default Layout;
