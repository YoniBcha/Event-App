"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import { useGetEventTypesQuery } from "@/store/endpoints/apiSlice";
import { useState } from "react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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

  // ✅ Ensure data is properly typed
  const eventTypes: EventTypeData[] = data?.eventTypes ?? [];

  const handleEventTypeSelect = (eventTypeId: string) => {
    setSelectedEventTypeId(eventTypeId);
    onEventTypeSelect(eventTypeId);
  };

  return (
    <div className="flex flex-col justify-center gap-4 items-center">
      <div className="text-primary font-bold text-4xl">Event Type</div>

      {isLoading ? (
        <div className="text-center">Loading event types...</div>
      ) : error ? (
        <div className="text-center text-red-500">
          Error: {error instanceof Error ? error.message : "An error occurred"}
        </div>
      ) : (
        <div className="w-[85%] px-4">
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
                <div className="relative w-full h-80">
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

      <div className="flex flex-row gap-5 mt-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg border border-primary text-primary cursor-pointer hover:bg-gray-200 transition"
        >
          &lt; Back
        </button>
        <button
          onClick={() => onNext(selectedEventTypeId)}
          className={`p-2 rounded-lg text-gray-100 cursor-pointer transition ${
            selectedEventTypeId
              ? "bg-primary hover:bg-primary-dark"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!selectedEventTypeId}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default EventTypeComponent;
