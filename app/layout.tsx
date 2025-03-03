"use client";
// import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Withstore from "./WithStore";
import { ReactNode, useEffect, useState } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [currentLocale, setCurrentLocale] = useState("en"); // Default to "en"

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLocale = localStorage.getItem("locale") || "en";
      setCurrentLocale(storedLocale);
    }
  }, []);

  return (
    <html lang={currentLocale} dir={currentLocale === "ar" ? "rtl" : "ltr"}>
      <body className={`antialiased px-4 md:px-20  `}>
        <div className="bottom-left -z-10"></div>
        <div className="bottom-right -z-10"></div>

        <Withstore>
          <Header />
          {children}
          <Footer />
        </Withstore>
      </body>
    </html>
  );
}
