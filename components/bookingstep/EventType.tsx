"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import { useGetEventTypesQuery } from "@/store/endpoints/apiSlice";
import { useState } from "react";
import { useSelector } from "react-redux";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./swiper-custom.css"; // Create this file for custom styles

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

  const translations = useSelector((state: RootState) => state.language.translations);

  const handleEventTypeSelect = (eventTypeId: string) => {
    setSelectedEventTypeId(eventTypeId);
    onEventTypeSelect(eventTypeId);
  };
  const handleBackClick = () => {
    onBack();
  }

  if (!isLoading && eventTypes.length === 0) {
    return (
      <div className="flex flex-col gap-10 h-full justify-center items-center">
        <div className="text-primary font-bold text-xl md:text-3xl text-center">
          No Types Available
        </div>
        <button
          onClick={handleBackClick}
          className="flex items-center p-2 rounded-lg border border-primary text-primary cursor-pointer"
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
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center gap-4 items-center h-full">
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
        <div className="w-[90%] px-4">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ type: "fraction", el: ".swiper-pagination" }}
            navigation={true}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {eventTypes.map((eventType) => (
              <SwiperSlide
                key={eventType._id}
                onClick={() => handleEventTypeSelect(eventType._id)}
                className={`flex flex-col items-center cursor-pointer px-1 py-2 rounded-lg transition-all duration-300 ${
                  selectedEventTypeId === eventType._id
                    ? "border-2 border-primary scale-105"
                    : "border border-gray-300"
                }`}
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
              </SwiperSlide>
            ))}
            <div className="swiper-pagination mt-2"></div>
          </Swiper>
        </div>
      )}

      <div className="flex flex-row gap-5 my-4">
        <button
          onClick={onBack}
          className="back-btn"
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
          <span>{translations.booking.backBtn}</span>
        </button>
        <button
          onClick={() => onNext(selectedEventTypeId)}
          className={`next-btn ${
            selectedEventTypeId
              ? "bg-primary hover:bg-[#faebdc] hover:text-primary"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!selectedEventTypeId}
        >
          <span>{ translations.booking.nextBtn}</span>
          <span className="ml-3 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <path
                fill="#fff"
                d="M17.1 5L14 8.1L29.9 24L14 39.9l3.1 3.1L36 24z"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default EventTypeComponent;
