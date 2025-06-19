"use client";
import "../globals.css";
import Withstore from "./WithStore";
import { ReactNode, useEffect, useState } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [currentLocale, setCurrentLocale] = useState("ar"); // Default to "ar"

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if locale exists in localStorage
      const storedLocale = localStorage.getItem("locale");
      
      // If no locale is stored, it's the first visit - set to "ar"
      if (!storedLocale) {
        localStorage.setItem("locale", "ar");
        setCurrentLocale("ar");
      } else {
        // If locale exists, use the stored value
        setCurrentLocale(storedLocale);
      }
    }
  }, []);

  return (
    <html lang={currentLocale} dir={currentLocale === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="icon" href="/pp.jpg" />
      </head>

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