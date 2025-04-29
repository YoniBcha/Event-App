/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useGetPackageDetailQuery } from "@/store/endpoints/apiSlice"; // Import the Redux query
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

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
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getDescription = () => {
    const fullDescription = renderValue(
      packageData?.eventPackage?.description,
      packageData?.eventPackage?.translatedDescription
    ).replace(/\n/g, "<br />");

    if (
      typeof window !== "undefined" &&
      window.innerWidth < 768 &&
      !isExpanded
    ) {
      return fullDescription.length > 150
        ? `${fullDescription.substring(0, 150)}...`
        : fullDescription;
    }
    return fullDescription;
  };

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
                <span className="font-bold flex items-center">
                  <p className="text-black text-xl  items-center font-extrabold">
                    {" "}
                    {packageData.eventPackage.packagePrice}
                  </p>

                  <Image
                    src="/images/SR.png"
                    alt="SR"
                    width={20}
                    height={15}
                    className={currentLocale === "ar" ? "scale-x-[-1]" : ""}
                  />
                </span>{" "}
              </div>

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
                      className="relative bg-white flex flex-col p-6  rounded-lg shadow-lg max-w-[90%] max-h-[90%] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2 className="text-xl font-semibold text-primary mb-4 mt-5 break-words">
                        {renderValue(
                          selectedItem?.typeName,
                          selectedItem?.translatedTypeName
                        )}
                      </h2>
                      <div className="flex-1 flex items-center justify-center">
                        <Image
                          src={selectedItem?.typePicture}
                          alt="Selected Image"
                          width={250}
                          height={250}
                          className="object-contain max-w-full max-h-full"
                        />
                      </div>
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
                    __html: getDescription(),
                  }}
                />
                {typeof window !== "undefined" &&
                  window.innerWidth < 570 &&
                  renderValue(
                    packageData?.eventPackage?.description,
                    packageData?.eventPackage?.translatedDescription
                  ).length > 50 && (
                    <button
                      onClick={(e) => {
                        setIsExpanded(!isExpanded);
                        e.stopPropagation();
                      }}
                      className="text-primary font-semibold text-sm mt-1"
                    >
                      {isExpanded
                        ? translations.see_less
                        : translations.see_more}
                    </button>
                  )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-5">
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className=" flex items-center p-2 rounded-full text-white cursor-pointer bg-primary hover:bg-secondary hover:text-primary"
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
          <span className="">
            {currentLocale === "ar" ? (
              <AiOutlineRight size={20} />
            ) : (
              <AiOutlineLeft size={20} />
            )}
          </span>
        </motion.button>

        <motion.button
          onClick={handleNextClick}
          className=" flex items-center p-2 rounded-full text-white cursor-pointer bg-primary hover:bg-secondary hover:text-primary"
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
          <span className="">
            {currentLocale === "ar" ? (
              <AiOutlineLeft size={20} />
            ) : (
              <AiOutlineRight size={20} />
            )}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default PackageDetails;
