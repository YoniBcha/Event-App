/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { useGetPackageQuery } from "@/store/endpoints/apiSlice";
import { useSelector } from "react-redux";
import "swiper/css";

import "swiper/css/pagination";
import "./swiper-custom.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Package {
  _id: string;
  packageName: string;
  packagePrice: string;
  image: string[];
  description: string;
  eventType: string;
  eventDesign: string;
  place: string;
  additions: {
    additionId: string;
    typeOfAddition: string;
    quantity: number;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ChoosePackageProps {
  place: string;
  eventType: string;
  eventDesign: string;
  onNext: (selectedPackageId: string | null) => void;
  onBackClick: () => void;
}

function ChoosePackage({
  place,
  eventType,
  eventDesign,
  onNext,
  onBackClick,
}: ChoosePackageProps) {
  const { data, error, isLoading } = useGetPackageQuery({
    eventDesign,
    eventType,
    place,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const translations = useSelector((state: any) => state.language.translations);

  // Framer Motion Variants
  const slideVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2, ease: "easeInOut" },
      backgroundColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--secondary")
        .trim(),
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1, ease: "easeInOut" },
    },
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !isGridView) {
        setIsGridView(true); // Switch to grid view on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isGridView]);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCardClick = (packageId: string) => {
    setSelectedPackageId(packageId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  // const toggleView = () => {
  //   setIsGridView(!isGridView);
  // };

  if (error) return <p>Failed to load packages</p>;

  const packages = (data as { eventPackages: Package[] })?.eventPackages || [];

  // Check if there are no packages
  if (!isLoading && packages.length === 0) {
    return (
      <motion.div
        className="flex flex-col gap-10 h-full justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-primary font-bold text-xl md:text-3xl text-center">
          {translations.booking.noPackage}
        </div>

        {/* Back Button */}
        <motion.button
          onClick={onBackClick}
          className="back-btn flex items-center hover:bg-secondary p-2 rounded-lg border border-primary text-primary cursor-pointer"
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
          <span className="mr-2">
            {currentLocale === "ar" ? (
              <FaChevronRight /> // Right arrow for Arabic
            ) : (
              <FaChevronLeft /> // Left arrow for English
            )}
          </span>
          <span>{translations.booking.backBtn}</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 h-full">
      <div className="text-primary font-bold text-2xl md:text-3xl pt-5 text-center">
        {translations.booking.choosePackage}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* List View for Small Devices (sm and below) */}
          <div className="flex w-full sm:hidden flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 [@media(min-width:361px)]:grid-cols-2 [@media(min-width:639px)]:grid-cols-2">
              {packages.map((eventPackage: Package, index: number) => (
                <motion.div
                  key={eventPackage._id || index}
                  className={`flex flex-col justify-center items-center bg-gray-100 rounded-lg overflow-hidden cursor-pointer p-2 transition-all duration-300 ${
                    selectedPackageId === eventPackage._id
                      ? "border-2 border-primary scale-105"
                      : "border border-gray-300"
                  }`}
                  onClick={() => handleCardClick(eventPackage._id)}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div
                    className="relative w-full h-48"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageClick(eventPackage.image[0]);
                    }}
                  >
                    <Image
                      src={eventPackage.image[0]}
                      alt={eventPackage.packageName}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                  <p className="mt-2 text-sm text-tertiary font-medium flex items-center text-center">
                    {eventPackage.packageName} - {eventPackage.packagePrice}{" "}
                    <Image
                      src="/images/SR.png"
                      alt="SR"
                      width={20}
                      height={20}
                      className={currentLocale === "ar" ? "scale-x-[-1]" : ""}
                    />
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Swiper for Medium Devices (md and above) */}
          <div className="hidden sm:block w-[90%] px-4 relative">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ type: "fraction", el: ".swiper-pagination" }}
              navigation={{
                nextEl: ".swiper-button-next", // Custom next button selector
                prevEl: ".swiper-button-prev", // Custom previous button selector
              }}
              breakpoints={{
                640: { slidesPerView: 3 }, // For tablets)
                1024: { slidesPerView: 4 }, // For desktops)
              }}
            >
              {packages.map((eventPackage: Package, index: number) => (
                <SwiperSlide
                  key={eventPackage._id || index}
                  onClick={() => handleCardClick(eventPackage._id)}
                >
                  <motion.div
                    className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                      selectedPackageId === eventPackage._id
                        ? "border-2 border-primary scale-105"
                        : "border border-gray-300"
                    }`}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <div
                      className="relative w-full h-64"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(eventPackage.image[0]);
                      }}
                    >
                      <Image
                        src={eventPackage.image[0]}
                        alt={eventPackage.packageName}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                      />
                    </div>
                    <div className="mt-2 text-sm flex flex-row font-bold text-tertiary items-center text-center">
                      {eventPackage.packageName} - {eventPackage.packagePrice}
                      <span className="mx-1 pt-[0.2rem]">
                        <Image
                          src="/images/SR.png"
                          alt="SR"
                          width={12}
                          height={10}
                          className={
                            currentLocale === "ar" ? "scale-x-[-1]" : ""
                          }
                        />
                      </span>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
              <div className="swiper-pagination mt-2"></div>
              {/* Custom Navigation Buttons */}
            </Swiper>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>
        </>
      )}

      {/* Modal for Enlarged Image */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-11/12 md:w-3/4 lg:w-1/2 h-1/2 md:h-3/4 rounded-lg p-4"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage}
                  alt="Selected Image"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-5 my-5">
        {/* Back Button */}
        <motion.button
          onClick={onBackClick}
          className="back-btn flex items-center hover:bg-secondary p-2 rounded-lg border border-primary text-primary cursor-pointer"
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
          onClick={() => onNext(selectedPackageId)}
          disabled={!selectedPackageId}
          className={`next-btn flex items-center p-2 rounded-lg text-white cursor-pointer ${
            selectedPackageId
              ? "bg-primary hover:bg-secondary hover:text-primary"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
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
          whileHover={selectedPackageId ? "hover" : {}}
          whileTap={selectedPackageId ? "tap" : {}}
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
    </div>
  );
}

export default ChoosePackage;
