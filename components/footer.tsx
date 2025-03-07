/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";

function Footer() {
  const translations = useSelector((state: any) => state.language.translations);

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
        <motion.a
          href="/terms&conditions"
          whileHover={{ scale: 1.05 }} // Scale up and change color on hover
          transition={{ type: "spring", stiffness: 300 }} // Smooth spring animation
          className="hover:text-gray-500 cursor-pointer"
        >
          {translations.termsAndConditions}
        </motion.a>
        <motion.a
          href="/privacy_Policy"
          whileHover={{ scale: 1.05 }} // Scale up and change color on hover
          transition={{ type: "spring", stiffness: 300 }} // Smooth spring animation
          className="hover:text-gray-500 cursor-pointer"
        >
          {translations.privacyPolicy}
        </motion.a>
      </div>
    </motion.div>
  );
}

export default Footer;
