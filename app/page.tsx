/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const translations = useSelector((state: any) => state.language.translations);
  const router = useRouter();
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      className="md:h-full w-full flex flex-col md:flex-row"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full md:hidden flex gap-2 justify-evenly">
        <motion.div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/images/Rectangle 2202.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={imageVariants}
        ></motion.div>
        <motion.div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/images/Rectangle 220.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={imageVariants}
        ></motion.div>
        <motion.div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/images/recr.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={imageVariants}
        ></motion.div>
      </div>

      <motion.div
        className="w-full mt-5 md:w-1/2 flex flex-col gap-3 text-start items-start md:justify-center"
        variants={containerVariants}
      >
        <motion.div className="text-start" variants={itemVariants}>
          {translations.welcome}
        </motion.div>
        <motion.div
          className="text-5xl text-primary max-sm:text-3xl font-bold"
          variants={itemVariants}
        >
          {translations.fenzo}
        </motion.div>
        <motion.div variants={itemVariants}>{translations.subTitle}</motion.div>
        <motion.button
          className="p-2 text-gray-100 bg-primary hover:bg-secondary hover:text-primary rounded"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/mainpage/1")}
        >
          {translations.startJourney}
        </motion.button>
      </motion.div>

      <div className="w-1/2 sm:hidden md:flex flex-row gap-2 mx-3 justify-evenly">
        <motion.div
          className="w-1/3"
          style={{
            backgroundImage: "url('/images/Rectangle 2202.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={imageVariants}
        ></motion.div>
        <motion.div
          className="w-1/3"
          style={{
            backgroundImage: "url('/images/Rectangle 220.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={imageVariants}
        ></motion.div>
        <motion.div
          className="w-1/3"
          style={{
            backgroundImage: "url('/images/recr.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={imageVariants}
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
