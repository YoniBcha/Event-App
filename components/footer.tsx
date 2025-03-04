import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
function Footer() {
  return (
    <motion.div
      initial={{ x: "-100%" }} // Start from right corner
      animate={{ x: "0%" }} // Move to left
      transition={{
        type: "spring", // Adds bounce effect
        stiffness: 100, // Adjusts the bounciness
        damping: 10, // Controls how quickly it settles
      }}
      className="w-full py-2 md:py-7 bg-transparent flex flex-row justify-between items-center text-sm text-primary mt-auto"
    >
      <div className="flex flex-row gap-4 items-center">
        <div>&copy; 2025 FENZO</div>
      </div>

      <div className="flex flex-row max-[400px]:gap-2 max-[300px]:flex-col gap-4">
        <Link
          href={"/terms&conditions"}
          className="hover:text-gray-500 cursor-pointer"
        >
          Terms & Conditions
        </Link>
        <Link
          href={"/privacy_Policy"}
          className="hover:text-gray-500 cursor-pointer"
        >
          Privacy Policy
        </Link>
      </div>
    </motion.div>
  );
}

export default Footer;
