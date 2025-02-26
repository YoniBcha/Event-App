/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react"; // Add useEffect
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { useGetChooseDesignsQuery } from "@/store/endpoints/apiSlice";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./swiper-custom.css"; // Create this file for custom styles
import { FaBars, FaChevronLeft, FaChevronRight, FaTh } from "react-icons/fa";
interface Design {
  _id: string;
  eventDesign: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ChooseDesignsProps {
  id: string;
  onNext: (selectedDesignId: string | null) => void;
  onBackClick: () => void;
}

function ChooseDesigns({ id, onNext, onBackClick }: ChooseDesignsProps) {
  const { data, error, isLoading } = useGetChooseDesignsQuery(id) as {
    data?: { eventType?: { eventDesigns?: Design[] } };
    error?: unknown;
    isLoading: boolean;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const translations = useSelector((state: any) => state.language.translations);

  // Handle window resize to dynamically switch to grid view on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 414 && !isGridView) {
        setIsGridView(true); // Switch to grid view on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isGridView]);

  // const handleImageClick = (image: string) => {
  //   setSelectedImage(image);
  //   setIsModalOpen(true);
  // };

  const handleCardClick = (designId: string) => {
    setSelectedDesignId(designId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  const handleNextClick = () => {
    if (selectedDesignId) {
      onNext(selectedDesignId);
    } else {
      alert("Please select a design before proceeding.");
    }
  };

  const handleBackClick = () => {
    onBackClick();
  };

  // Framer Motion Variants
  const slideVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  if (error) return <p>Failed to load designs</p>;

  const designs: Design[] = data?.eventType?.eventDesigns ?? [];

  // Check if there are no designs
  if (!isLoading && designs.length === 0) {
    return (
      <motion.div
        className="flex flex-col gap-10 h-full justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-primary font-bold text-xl md:text-3xl text-center">
          No Designs Available
        </div>
        <motion.button
          onClick={handleBackClick}
          className="flex items-center p-2 rounded-lg border border-primary text-primary cursor-pointer"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 12 24"
            >
              <path
                fill="#c2937b"
                fillRule="evenodd"
                d="M10 19.438L8.955 20.5l-7.666-7.79a1.02 1.02 0 0 1 0-1.42L8.955 3.5L10 4.563L2.682 12z"
              />
            </svg>
          </span>
          <span>Back</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-4 h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-primary font-bold text-xl md:text-3xl pt-5 text-center">
        {translations.booking.chooseDesign}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        // Grid View
        <div className="w-full px-4">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ type: "fraction", el: ".swiper-pagination" }}
            navigation={{
              nextEl: ".swiper-button-next", // Custom next button selector
              prevEl: ".swiper-button-prev", // Custom previous button selector
            }}
            modules={[Grid, Pagination, Navigation]} // Add Navigation module
            breakpoints={{
              320: { slidesPerView: 1 }, // For small screens (mobile)
              480: { slidesPerView: 2 }, // For slightly larger mobile screens
              640: { slidesPerView: 3 }, // For tablets
              1024: { slidesPerView: 4 }, // For desktops
            }}
            className="mySwiper"
          >
            {designs.map((design: Design, index: number) => (
              <SwiperSlide
                key={design._id || index}
                onClick={() => handleCardClick(design._id)}
              >
                <motion.div
                  className={`flex flex-col items-center cursor-pointer px-1 py-2 rounded-lg transition-all duration-300 ${
                    selectedDesignId === design._id
                      ? "border-2 border-primary scale-105"
                      : "border border-gray-300"
                  }`}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hover: {
                      scale: 1.05,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                      backgroundColor: getComputedStyle(
                        document.documentElement
                      )
                        .getPropertyValue("--secondary")
                        .trim(),
                      transition: { duration: 0.2, ease: "easeInOut" },
                    },
                    tap: {
                      scale: 0.95,
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                      transition: { duration: 0.1, ease: "easeInOut" },
                    },
                  }}
                  whileHover={"hover"}
                  whileTap={"tap"}
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={design.image}
                      alt={design.eventDesign}
                      layout="fill"
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <p className="mt-2 text-sm text-tertiary font-medium text-center">
                    {design.eventDesign}
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
            {/* Custom Pagination */}
            <div className="swiper-pagination mt-2"></div>
            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </Swiper>
        </div>
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
          onClick={handleBackClick}
          className="back-btn flex items-center p-2 hover:bg-secondary rounded-lg border border-primary text-primary cursor-pointer"
          variants={{
            hover: {
              scale: 1.05,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              borderColor: getComputedStyle(document.documentElement)
                .getPropertyValue("--secondary")
                .trim(),
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
          disabled={!selectedDesignId}
          className={`next-btn flex items-center p-2 rounded-lg text-white cursor-pointer ${
            selectedDesignId
              ? "bg-primary hover:bg-[#faebdc] hover:text-primary"
              : "bg-gray-400 text-gray-100 cursor-not-allowed"
          }`}
          variants={{
            hover: {
              scale: 1.05,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              backgroundColor: getComputedStyle(document.documentElement)
                .getPropertyValue("--secondary")
                .trim(),
              transition: { duration: 0.2, ease: "easeInOut" },
            },
            tap: {
              scale: 0.95,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              transition: { duration: 0.1, ease: "easeInOut" },
            },
          }}
          whileHover={selectedDesignId ? "hover" : {}}
          whileTap={selectedDesignId ? "tap" : {}}
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

export default ChooseDesigns;
