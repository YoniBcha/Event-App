import React from "react";
import { motion } from "framer-motion";
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

      <div className="flex flex-col md:flex-row gap-1 md:gap-4">
        <div>Terms & Conditions</div>
        <div>Privacy Policy</div>
      </div>
    </motion.div>
  );
}

export default Footer;
