/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname

function Footer() {
  const translations = useSelector((state: any) => state.language.translations);
  const pathname = usePathname(); // Get the current route

  return (
    <motion.div
      initial={{ x: "-100%" }} // Start from right corner
      animate={{ x: "0%" }} // Move to left
      transition={{
        type: "spring", // Adds bounce effect
        stiffness: 100, // Adjusts the bounciness
        damping: 10, // Controls how quickly it settles
      }}
      className="w-full py-4 md:py-7 bg-transparent flex flex-row justify-between items-center text-sm text-primary mt-auto"
    >
      <div className="flex flex-row gap-4 items-center">
        <div>&copy; 2025 {translations.fenzo}</div>
      </div>

      <div className="flex flex-row max-[400px]:gap-2 max-[300px]:flex-col gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }} // Scale up on hover
          transition={{ type: "spring", stiffness: 300 }} // Smooth spring animation
        >
          <Link
            href={"/terms&conditions"}
            className={`hover:text-gray-500 cursor-pointer ${
              pathname === "/terms&conditions"
                ? " border-b border-primary font-bold"
                : ""
            }`} // Active style
          >
            {translations.termsAndConditions}
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }} // Scale up on hover
          transition={{ type: "spring", stiffness: 300 }} // Smooth spring animation
        >
          <Link
            href={"/privacy_Policy"}
            className={`hover:text-gray-500 cursor-pointer ${
              pathname === "/privacy_Policy"
                ? "border-b border-primary font-bold"
                : ""
            }`} // Active style
          >
            {translations.privacyPolicy}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Footer;
