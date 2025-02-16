"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";
import Image from "next/image";
import { useGetChooseDesignsQuery } from "@/store/endpoints/apiSlice";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

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
  onNext: (selectedDesignId: string | null) => void; // Callback to send the selected design ID to the parent
  onBackClick: () => void; // Callback for "Back" button click
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

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCardClick = (designId: string) => {
    setSelectedDesignId(designId); // Set the selected design ID
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
      onNext(selectedDesignId); // Send the selected design ID to the parent
    } else {
      alert("Please select a design before proceeding.");
    }
  };

  const handleBackClick = () => {
    onBackClick();
  };

  if (isLoading) return <p>Loading designs...</p>;
  if (error) return <p>Failed to load designs</p>;

  const designs: Design[] = data?.eventType?.eventDesigns ?? [];

  return (
    <div className="flex flex-col justify-center gap-4 items-center p-4">
      <div className="text-primary font-bold text-2xl">Choose Designs</div>

      <button
        onClick={toggleView}
        className="md:hidden p-2 rounded-lg bg-primary text-gray-100 cursor-pointer"
      >
        {isGridView ? "Switch to List View" : "Switch to Grid View"}
      </button>

      <div className="w-full md:w-2/3 h-full overflow-y-auto">
        {isGridView ? (
          <Swiper
            slidesPerView={4}
            grid={{
              rows: 2,
              fill: "row",
            }}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            modules={[Grid, Pagination]}
            breakpoints={{
              320: {
                slidesPerView: 2,
                grid: {
                  rows: 2,
                },
              },
              768: {
                slidesPerView: 4,
                grid: {
                  rows: 2,
                },
              },
            }}
            className="mySwiper"
          >
            {designs.map((design: Design, index: number) => (
              <SwiperSlide
                key={design._id || index}
                onClick={() => handleCardClick(design._id)} // Pass the design ID
                className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                  selectedDesignId === design._id
                    ? "border-2 border-primary scale-105"
                    : "border border-gray-300"
                }`}
              >
                <div
                  className="relative w-full h-48"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick(design.image);
                  }}
                >
                  <Image
                    src={design.image}
                    alt={design.eventDesign}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <p className="mt-2 text-sm font-bold text-tertiary text-center">
                  {design.eventDesign}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // List View (1 column)
          <div className="flex flex-col gap-4">
            {designs.map((design: Design, index: number) => (
              <div
                key={design._id || index}
                className={`flex flex-col justify-center items-center bg-gray-100 rounded-lg overflow-hidden cursor-pointer p-2 transition-all duration-300 ${
                  selectedDesignId === design._id
                    ? "border-4 border-primary scale-105"
                    : "border border-gray-300"
                }`}
                onClick={() => handleCardClick(design._id)} // Pass the design ID
              >
                <div
                  className="relative w-full h-48"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick(design.image);
                  }}
                >
                  <Image
                    src={design.image}
                    alt={design.eventDesign}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <p className="mt-2 text-sm text-tertiary font-medium text-center">
                  {design.eventDesign}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50"
          onClick={closeModal}
        >
          <div className="relative w-11/12 md:w-3/4 lg:w-1/2 h-1/2 md:h-3/4 rounded-lg p-4">
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Selected Image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-5">
        <button
          onClick={handleBackClick}
          className="p-2 rounded-lg border border-primary text-primary cursor-pointer"
        >
          &lt; Back
        </button>
        <button
          onClick={handleNextClick} // Use handleNextClick to send the selected design ID
          className="p-2 rounded-lg bg-primary text-gray-100 cursor-pointer"
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}

export default ChooseDesigns;
