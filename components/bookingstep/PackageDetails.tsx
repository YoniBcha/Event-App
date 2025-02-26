/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useGetPackageDetailQuery } from "@/store/endpoints/apiSlice"; // Import the Redux query
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function PackageDetails({
  packageId,
  onNextClick,
  onBack,
}: {
  packageId: any;
  onNextClick: any;
  onBack: any;
}) {
  const { data: packageData, isLoading } =
    useGetPackageDetailQuery<any>(packageId);
  const translations = useSelector((state: any) => state.language.translations);
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const [selectedImage, setSelectedImage] = useState("");

  React.useEffect(() => {
    if (packageData?.eventPackage?.image?.length > 0) {
      setSelectedImage(packageData.eventPackage.image[0]);
    }
  }, [packageData]);

  const handleImageClick = (imageUrl: any) => {
    setSelectedImage(imageUrl);
  };

  const handleNextClick = () => {
    if (onNextClick) {
      onNextClick(packageId);
    }
  };

  // Framer Motion Variants
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  // const buttonVariants = {
  //   hover: { scale: 1.05 },
  //   tap: { scale: 0.95 },
  // };

  return (
    <motion.div
      className="flex flex-col justify-center gap-4 items-center h-full pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex-grow flex flex-col justify-center items-center w-full h-full mt-6 md:mt-0">
        <div className="text-primary font-bold text-xl md:text-3xl py-5">
          {translations.booking.packageDetails}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-3 md:flex-row bg-gradient-to-r from-secondary to-white w-full max-[550px]:w-full max-lg:w-4/5 md:w-[85%] lg:w-3/4 h-fit max-md:bg-transparent p-3 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col w-full lg:w-1/4 md:w-2/4 h-full">
              <div className="flex flex-col w-full">
                <div className="min-h-[200px] w-full rounded bg-slate-500 flex items-center justify-center relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImage}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={imageVariants}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      {selectedImage ? (
                        <Image
                          src={selectedImage}
                          alt="Selected"
                          fill
                          className="object-cover rounded"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      ) : (
                        <span>Select an image</span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="py-2 grid grid-cols-4 gap-2">
                {packageData.eventPackage.image.map(
                  (imageUrl: any, index: any) => (
                    <motion.div
                      key={index}
                      className="rounded cursor-pointer overflow-hidden relative w-full h-12 md:h-6"
                      onClick={() => handleImageClick(imageUrl)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </motion.div>
                  )
                )}
              </div>

              <div className="h-14 grid grid-cols-2 gap-3 max-md:grid-cols-3 max-[400px]:grid-cols-2 pt-1">
                {packageData.eventPackage.additions.map(
                  (addition: any, index: any) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-5"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Image
                        src={addition.additionId.logo}
                        width={20}
                        height={20}
                        alt={addition.additionId.additionName}
                      />
                      <div className="text-primary text-sm">
                        {addition.additionId.additionName}
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </div>

            <motion.div
              className="w-full h-full md:w-3/4 ml-0 md:ml-5 mt-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h3 className="text-xl flex items-center font-semibold">
                  {packageData.eventPackage.packageName}{" "}
                  {packageData.eventPackage.packagePrice}{" "}
                  <Image src="/images/SR.png" alt="SR" width={20} height={20} />
                </h3>
                <div
                  className="mt-2 p-2 text-sm md:text-base overflow-hidden"
                  style={{ wordWrap: "break-word" }}
                  dangerouslySetInnerHTML={{
                    __html: packageData.eventPackage.description.replace(
                      /\n/g,
                      "<br />"
                    ),
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-5">
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="back-btn flex items-center p-2 hover:bg-secondary rounded-lg border border-primary text-primary cursor-pointer"
          variants={{
            hover: {
              scale: 1.05,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              borderColor: "#a57a6a",
              transition: { duration: 0.2, ease: "easeInOut" },
            },
            tap: {
              scale: 0.95,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              transition: { duration: 0.1, ease: "easeInOut" },
            },
          }}
          whileHover="hover"
          whileTap="tap"
        >
          <span className="mr-2">
            {currentLocale === "ar" ? (
              <FaChevronRight /> // Right arrow for Arabic
            ) : (
              <FaChevronLeft /> // Left arrow for English
            )}
          </span>
          <span>{translations.booking.backBtn}</span>
        </motion.button>

        {/* Next Button */}
        <motion.button
          onClick={handleNextClick}
          className="next-btn flex items-center p-2 rounded-lg text-white bg-primary hover:bg-secondary hover:text-primary cursor-pointer"
          variants={{
            hover: {
              scale: 1.05,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",

              transition: { duration: 0.2, ease: "easeInOut" },
            },
            tap: {
              scale: 0.95,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              transition: { duration: 0.1, ease: "easeInOut" },
            },
          }}
          whileHover="hover"
          whileTap="tap"
        >
          <span>{translations.booking.nextBtn}</span>
          <span className="ml-3">
            {currentLocale === "ar" ? (
              <FaChevronLeft /> // Left arrow for Arabic
            ) : (
              <FaChevronRight /> // Right arrow for English
            )}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default PackageDetails;
