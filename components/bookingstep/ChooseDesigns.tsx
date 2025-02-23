"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";
import Image from "next/image";
import { useGetChooseDesignsQuery } from "@/store/endpoints/apiSlice";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { useSelector } from "react-redux";

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
  interface RootState {
    language: {
      translations: {
        booking: {
          chooseDesign: string;
          backBtn: string;
          nextBtn: string;
        };
      };
    };
  }

  const translations = useSelector((state: RootState) => state.language.translations);
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

  if (error) return <p>Failed to load designs</p>;

  const designs: Design[] = data?.eventType?.eventDesigns ?? [];
   // Check if there are no designs
  if (!isLoading && designs.length === 0) {
    return (
      <div className="flex flex-col gap-10 h-full justify-center items-center">
        <div className="text-primary font-bold text-xl md:text-3xl text-center">
          No Designs Available
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
    <div className="flex flex-col gap-4  h-full">
      <div className="text-primary font-bold text-xl md:text-3xl pt-5 text-center">
        {translations.booking.chooseDesign}
      </div>

      <div className="flex justify-end items-center w-full">
        <button
          onClick={toggleView}
          className=" md:hidden p-2 rounded-lg text-gray-100 cursor-pointer"
        >
          {isGridView ? (
            <Image
              src={"/zip/menu.svg"}
              width={32}
              height={32}
              alt="List View"
            />
          ) : (
            <Image
              src={"/zip/dashboard-square-01.svg"}
              width={32}
              height={32}
              alt="Grid View"
            />
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : isGridView ? (
        // Grid View
        <div className="w-full px-4">
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
                  className="relative w-full h-64"
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
        </div>
      ) : (
        // List View
        <div className="flex flex-col gap-4 w-full px-4">
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

      {/* Modal for Enlarged Image */}
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

      <div className="flex justify-center gap-5 my-5">
        <button
          onClick={handleBackClick}
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
          onClick={handleNextClick}
          disabled={!selectedDesignId} // Disable if no design is selected
          className={`next-btn ${
            selectedDesignId
              ? "bg-primary hover:bg-[#faebdc] hover:text-primary"
              : "bg-gray-400 text-gray-100 cursor-not-allowed"
          }`}
        >
          <span>{ translations.booking.nextBtn}</span>
          <span className="ml-3">
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
}

export default ChooseDesigns;
