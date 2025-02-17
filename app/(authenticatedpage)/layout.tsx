/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect } from "react";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

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
    <div className="flex w-full mb-10 gap-6 p-5">
      <div className="w-[20%] flex-col items-center">
        <div className="flex flex-col gap-5 bg-[#fbf4e8] rounded-sm m-4 px-5 py-3">
          <Link
            href="/sidebar/profile"
            className={`flex gap-3 py-1 px-2 rounded text-primary hover:bg-primary hover:text-white font-bold ${
              pathname === "/sidebar/profile" ? "bg-primary text-white" : ""
            }`}
          >
            <div>🔎</div>
            <div>Profile</div>
          </Link>

          <Link
            href="/sidebar/my-orders"
            className={`flex gap-3 py-1 px-2 rounded text-primary hover:bg-primary hover:text-white font-bold ${
              pathname === "/sidebar/my-orders" ? "bg-primary text-white" : ""
            }`}
          >
            <div>🔎</div>
            <div>My Orders</div>
          </Link>
        </div>
      </div>

      <div className="md:w-[80%]">{children}</div>
    </div>
  );
}

export default Layout;
