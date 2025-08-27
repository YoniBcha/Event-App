/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGetBestSellingPackagesQuery } from "@/store/endpoints/apiSlice";
import Link from "next/link";

const Home: React.FC = () => {
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const translations = useSelector((state: any) => state.language.translations);
  const { data } = useGetBestSellingPackagesQuery({}) as any;
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
      className="w-full flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Mobile banner images */}
      <div className="w-full md:hidden flex gap-2 justify-evenly">
        <motion.div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/b3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={imageVariants}
        ></motion.div>
        <motion.div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/b1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={imageVariants}
        ></motion.div>
        <motion.div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/b2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={imageVariants}
        ></motion.div>
      </div>

      {/* Main content area */}
      <div className="w-full flex flex-col md:flex-row">
        {/* Left content with header and buttons */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col gap-3 text-start items-start md:justify-center px-4 md:px-8"
          variants={containerVariants}
        >
          <motion.div className="text-start py-3" variants={itemVariants}>
            {translations.welcome}
          </motion.div>

          <div className="w-full flex justify-between items-center">
            <motion.div
              className="text-5xl text-primary max-sm:text-3xl font-bold"
              variants={itemVariants}
            >
              {translations.fenzo}
            </motion.div>
            <motion.button
              className="p-2 text-gray-100 bg-primary mr-14 self-start hover:bg-secondary hover:text-primary rounded"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/mainpage/1")}
            >
              {translations.startJourney}
            </motion.button>
          </div>

          <motion.div variants={itemVariants}>
            {translations.subTitle1}
          </motion.div>
          <motion.div variants={itemVariants}>
            {translations.subTitle}
          </motion.div>

          {/* Social icons container */}
          <div className="w-full flex justify-around items-center py-9 gap-5 md:gap-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <Image
                src="/images/new.png"
                alt="Events"
                width={85}
                height={85}
              />
              <div className="font-semibold max-md:text-sm text-primary">
                {translations.new}
              </div>
            </div>
            <Link
              href="https://www.instagram.com/fenzo_events"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 text-center"
            >
              <Image
                src="/instagram icon.png"
                alt="Instagram"
                width={80}
                height={80}
              />
              <div className="font-semibold max-md:text-sm text-primary">
                {translations.instagram}
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Desktop banner images */}
        <div className="w-1/2 sm:hidden md:flex flex-row gap-2 mx-3 justify-evenly">
          <motion.div
            className="w-1/3"
            style={{
              backgroundImage: "url('/b2.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            variants={imageVariants}
          ></motion.div>
          <motion.div
            className="w-1/3"
            style={{
              backgroundImage: "url('/b1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            variants={imageVariants}
          ></motion.div>
          <motion.div
            className="w-1/3"
            style={{
              backgroundImage: "url('/b3.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            variants={imageVariants}
          ></motion.div>
        </div>
      </div>

      {/* Best Selling Packages Section - Now properly separated */}
      {data?.data?.length > 0 && (
        <motion.div
          className="w-full px-4 md:px-8 mt-8"
          variants={containerVariants}
        >
          <p className="text-primary font-bold mb-6 text-start text-3xl">
            {translations.most_sold}
          </p>

          {/* Grid layout for packages */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {data?.data?.map((item: any, idx: number) => (
                <motion.div
                  key={item.id ?? idx}
                  className="flex flex-col items-center  transition cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  // onClick={() => router.push(`/package/${item.id}`)}
                >
                  {/* Image on Top */}
                  {item?.image?.[0] ? (
                    <Image
                      src={item.image[0]}
                      alt={item.title || "package image"}
                      width={80}
                      height={80}
                      className="rounded-2xl object-cover w-36 h-36"
                    />
                  ) : (
                    <div className="w-36 h-36 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                  {/* Package Name */}
                  <div className="mt-2 text-sm text-primary font-semibold text-center line-clamp-2">
                    {currentLocale === "en"
                      ? item.packageName
                      : item.translatedPackageName}
                  </div>
                  {/* Package Price */}
                  <div className="mt-1 text-primary text-sm text-center">
                    {item.packagePrice} SAR
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Home;
