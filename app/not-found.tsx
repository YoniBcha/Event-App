"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image"; // Import the Image component from Next.js

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        {/* Add the GIF using the Image component */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.5,
            type: "spring",
            stiffness: 100,
          }}
        >
          <Image
            src="/404Errorpage2.gif" // Path to the GIF in the public folder
            alt="404 Error Animation"
            width={350} // Set the width of the GIF
            height={50} // Set the height of the GIF
            className="mb-8" // Add margin below the GIF
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-2xl text-gray-600 mb-8"
        >
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-secondary transition-all duration-300"
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
