"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useGetEventTypesQuery } from "@/store/endpoints/apiSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./swiper-custom.css";

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
        };
      };
    };
  }

  const translations = useSelector(
    (state: RootState) => state.language.translations
  );
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );

  const handleEventTypeSelect = (eventTypeId: string) => {
    setSelectedEventTypeId(eventTypeId);
    onEventTypeSelect(eventTypeId);
  };

  const handleBackClick = () => {
    onBack();
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  if (!isLoading && eventTypes.length === 0) {
    return (
      <motion.div
        className="flex flex-col gap-10 h-full justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-primary font-bold text-xl md:text-3xl text-center">
          No Types Available
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
      className="flex flex-col justify-center gap-4 items-center md:h-full"
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
        <div className="w-full h-full px-2">
          {" "}
          {/* Reduced padding for mobile */}
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10} // Reduced space for mobile
            slidesPerView={1} // Default for small screens
            pagination={{ type: "fraction", el: ".swiper-pagination" }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 }, // Optimized for mobile
              640: { slidesPerView: 3, spaceBetween: 20 }, // Medium screens
              1024: { slidesPerView: 4, spaceBetween: 20 }, // Larger screens
            }}
            className="mySwiper" // Reduced padding for mobile
          >
            {eventTypes.map((eventType) => (
              <SwiperSlide
                key={eventType._id}
                onClick={() => handleEventTypeSelect(eventType._id)}
              >
                <motion.div
                  className={`flex flex-col items-center cursor-pointer px-1 py-2 rounded-lg transition-all duration-300 ${
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
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className="relative w-full h-64 aspect-square">
                    {" "}
                    {/* Fixed aspect ratio */}
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
            {/* Custom Pagination */}
            <div className="swiper-pagination mt-2"></div>
            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </Swiper>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
      )}

      <div className="flex flex-row gap-5 my-4">
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="back-btn flex hover:bg-secondary items-center p-2 rounded-lg border border-primary text-primary cursor-pointer"
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
              <AiOutlineRight size={20} />
            ) : (
              <AiOutlineLeft size={20} />
            )}
          </span>
          <span>{translations.booking.backBtn}</span>
        </motion.button>

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
              <AiOutlineLeft size={20} />
            ) : (
              <AiOutlineRight size={20} />
            )}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EventTypeComponent;
