/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useGetPackageDetailQuery } from "@/store/endpoints/apiSlice"; // Import the Redux query
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const renderValue = (
    defaultValue: string,
    translatedValue: string | undefined
  ) => {
    return currentLocale === "ar" && translatedValue
      ? translatedValue
      : defaultValue;
  };

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
          {renderValue(
            packageData?.eventPackage?.packageName,
            packageData?.eventPackage?.translatedPackageName
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-3 cursor-pointer md:flex-row bg-secondary w-full max-[550px]:w-full max-lg:w-4/5 md:w-[85%] lg:w-3/4 h-fit p-3 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleNextClick}
          >
            <div className="flex flex-col w-full lg:w-1/2 md:w-3/4 h-full">
              {/* <div
                className="flex flex-col w-full"
                onClick={(e) => e.stopPropagation()}
              >
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
                          className="object-fill rounded"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      ) : (
                        <span>Select an image</span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div> */}

              {/* Thumbnail Grid */}
              {/* <div
                className="py-2 grid grid-cols-4 gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {packageData.eventPackage.image.map(
                  (imageUrl: any, index: any) => (
                    <motion.div
                      key={index}
                      className="rounded cursor-pointer overflow-hidden relative aspect-square w-full"
                      onClick={() => handleImageClick(imageUrl)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        fill
                        className="object-cover rounded"
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                      />
                    </motion.div>
                  )
                )}
              </div> */}

              {/* Additions Section */}
              <div
                className="justify-center relative items-center grid grid-cols-1 gap-3 border backdrop-blur-xl bg-white/70 border-white rounded-lg  pt-1 w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {packageData?.eventPackage?.additions?.map((addition: any) =>
                  addition?.additionId?.typeDetail?.map(
                    (type: any, idx: any) => (
                      <motion.div
                        key={idx}
                        className="flex w-full items-start gap-3 p-2 cursor-pointer hover:bg-secondary rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => {
                          setSelectedItem(type); // Set the selected item
                          setIsModalOpen(true); // Open the modal
                        }}
                      >
                        {/* Image on the left side */}
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={type?.typePicture}
                            alt={type?.typeName}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>

                        {/* Title and description stacked vertically */}
                        <div className="flex flex-col gap-1">
                          {/* Title */}
                          <div className="text-primary font-semibold">
                            {renderValue(
                              type?.typeName,
                              type?.translatedTypeName
                            )}
                          </div>

                          {/* Description */}
                          {type?.typeDescription && (
                            <div className="text-sm text-gray-600">
                              {renderValue(
                                type?.typeDescription,
                                type?.translatedTypeDescription
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  )
                )}
              </div>
              <div className="flex flex-row gap-2 justify-end px-3 py-1 items-center">
                <span className="text-primary font-bold">
                  {translations.total}:
                </span>
                <span className="font-bold flex">
                  <p className="text-black text-xl font-extrabold">
                    {" "}
                    {packageData.eventPackage.packagePrice}
                  </p>

                  <Image
                    src="/images/SR.png"
                    alt="SR"
                    width={20}
                    height={20}
                    className={currentLocale === "ar" ? "scale-x-[-1]" : ""}
                  />
                </span>{" "}
              </div>

              {/* <AnimatePresence>
                {isModalOpen && (
                  <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.div
                      className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-primary">
                          {renderValue(
                            selectedItem?.typeName,
                            selectedItem?.translatedTypeName
                          )}
                        </h2>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Image
                            src={selectedItem?.typePicture}
                            width={60}
                            height={60}
                            alt={selectedItem?.typeName}
                            className=""
                          />
                        </div>
                        <div className="text-gray-600">
                          {renderValue(
                            selectedItem?.description,
                            selectedItem?.translatedDescription
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence> */}

              <AnimatePresence>
                {isModalOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 z-50"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="relative bg-white  flex-col  p-4 rounded-lg shadow-lg w-[300px] h-[300px] flex items-center justify-center" // Fixed size
                      onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
                    >
                      <h2 className="text-xl font-semibold text-primary">
                        {renderValue(
                          selectedItem?.typeName,
                          selectedItem?.translatedTypeName
                        )}
                      </h2>
                      <Image
                        src={selectedItem?.typePicture}
                        alt="Selected Image"
                        width={250} // Adjust image size to fit modal
                        height={250}
                        className="object-contain w-full h-full"
                      />
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-2 right-2 p-2 bg-primary text-white rounded-full hover:bg-secondary transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              className="w-full h-full md:w-3/4 ml-0 md:ml-5 mt-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h3 className="text-xl flex items-center font-semibold"></h3>
                <div
                  className="mt-2 p-2 text-sm md:text-base overflow-hidden"
                  style={{ wordWrap: "break-word" }}
                  dangerouslySetInnerHTML={{
                    __html: renderValue(
                      packageData.eventPackage.description,
                      packageData.eventPackage.translatedDescription
                    ).replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-5">
        {/* Back Button */}
        {/* <motion.button
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
        </motion.button> */}

        {/* Next Button */}
        {/* <motion.button
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
        </motion.button> */}
      </div>
    </motion.div>
  );
}

export default PackageDetails;
