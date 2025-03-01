/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { FiSettings, FiUser, FiEdit } from "react-icons/fi";

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

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const translations = useSelector((state: any) => state.language.translations);

  // If the user is not authenticated, do not render the layout
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row w-full mb-10 gap-2 md:gap-6">
      {/* Mobile Header with Avatar and Edit Icon */}
      <div className="md:hidden flex justify-center items-center p-4 bg-[#fbf4e8]">
        <div className="flex items-center gap-2">
          <div className="relative rounded-full border-4 border-primary w-16 h-16">
            <FiUser size={54} />
            <Link href="/sidebar/profile">
              <button className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-full text-white">
                <FiEdit size={20} className="cursor-pointer" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar (Hidden on Mobile) */}
      <div className=" md:block w-full md:w-[30%] flex-col items-center hidden">
        <div className="flex flex-col gap-5 bg-secondary rounded-sm m-4 p-2">
          <Link
            href="/sidebar/profile"
            className={`flex gap-3 py-1 px-2 rounded text-primary hover:bg-primary hover:text-white font-bold ${
              pathname === "/sidebar/profile" ? "bg-primary text-white" : ""
            }`}
          >
            <div>
              <FiUser size={18} />
            </div>
            <div>{translations.profile}</div>
          </Link>

          <Link
            href="/sidebar/my-orders"
            className={`flex gap-3 py-1 px-2 rounded text-primary hover:bg-primary hover:text-white font-bold ${
              pathname === "/sidebar/my-orders" ? "bg-primary text-white" : ""
            }`}
          >
            <div>
              <FiSettings size={18} />
            </div>
            <div>{translations.myOrders}</div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:w-[80%]">{children}</div>
    </div>
  );
}

export default Layout;
