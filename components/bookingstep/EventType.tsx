/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useGetEventTypesQuery } from "@/store/endpoints/apiSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion"; // Import Framer Motion

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./swiper-custom.css"; // Create this file for custom styles
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface EventTypeData {
  _id: string;
  nameOfEvent: string;
  image: string;
}

interface EventTypesResponse {
  eventTypes: EventTypeData[];
}

interface EventTypeProps {
  onEventTypeSelect: (eventTypeId: string) => void;
  onNext: (selectedEventTypeId: string | null) => void;
  onBack: () => void;
}

const EventTypeComponent = ({
  onEventTypeSelect,
  onNext,
  onBack,
}: EventTypeProps) => {
  const { data, error, isLoading } = useGetEventTypesQuery({}) as {
    data?: EventTypesResponse;
    error?: unknown;
    isLoading: boolean;
  };
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const [selectedEventTypeId, setSelectedEventTypeId] = useState<string | null>(
    null
  );

  const eventTypes: EventTypeData[] = data?.eventTypes ?? [];

  interface RootState {
    language: {
      translations: {
        booking: {
          eventType: string;
          backBtn: string;
          nextBtn: string;
          noEvent: string;
        };
      };
    };
  }

  const translations = useSelector(
    (state: RootState) => state.language.translations
  );

  const handleEventTypeSelect = (eventTypeId: string) => {
    setSelectedEventTypeId(eventTypeId);
    onEventTypeSelect(eventTypeId);
  };

  // Framer Motion Variants

  if (!isLoading && eventTypes.length === 0) {
    return (
      <motion.div
        className="flex flex-col gap-10 h-full justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-primary font-bold text-xl md:text-3xl text-center">
          {translations.booking.noEvent}
        </div>

        {/* Back Button */}
        {/* <motion.button
          onClick={onBack}
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
        </motion.button> */}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col justify-center gap-4 items-center h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-primary font-bold text-xl md:text-3xl py-5">
        {translations.booking.eventType}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          Error: {error instanceof Error ? error.message : "An error occurred"}
        </div>
      ) : (
        <div className="w-[90%] px-2 relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ type: "fraction", el: ".swiper-pagination" }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            breakpoints={{
              320: { slidesPerView: 1 }, // For small screens (mobile)
              480: { slidesPerView: 2 }, // For slightly larger mobile screens
              640: { slidesPerView: 3 }, // For tablets
              1024: { slidesPerView: 4 }, // For desktops
            }}
          >
            {eventTypes.map((eventType) => (
              <SwiperSlide
                key={eventType._id}
                onClick={() => handleEventTypeSelect(eventType._id)}
              >
                <motion.div
                  className={`flex flex-col items-center  cursor-pointer px-1 py-2 rounded-lg transition-all duration-300 ${
                    selectedEventTypeId === eventType._id
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
                      src={eventType.image}
                      alt={eventType.nameOfEvent}
                      layout="fill"
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <p className="mt-2 text-sm text-tertiary font-medium text-center">
                    {eventType.nameOfEvent}
                  </p>
                </motion.div>
              </SwiperSlide>
            ))}
            <div className="swiper-pagination mt-2"></div>
          </Swiper>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
      )}

      <div className="flex flex-row gap-5 my-4">
        {/* Back Button */}
        {/* <motion.button
          onClick={onBack}
          className="back-btn flex hover:bg-secondary items-center p-2 rounded-lg border border-primary text-primary cursor-pointer"
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
              <AiOutlineRight size={20} />
            ) : (
              <AiOutlineLeft size={20} />
            )}
          </span>
          <span>{translations.booking.backBtn}</span>
        </motion.button> */}

        {/* Next Button */}
        <motion.button
          onClick={() => onNext(selectedEventTypeId)}
          className={`next-btn flex items-center p-2 rounded-lg text-white cursor-pointer ${
            selectedEventTypeId
              ? "bg-primary hover:bg-[#faebdc] hover:text-primary"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!selectedEventTypeId}
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
          whileHover={selectedEventTypeId ? "hover" : {}}
          whileTap={selectedEventTypeId ? "tap" : {}}
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
};

export default EventTypeComponent;
