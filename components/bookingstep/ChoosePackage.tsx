"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";
import Image from "next/image";
import { useGetPackageQuery } from "@/store/endpoints/apiSlice";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "./swiper-custom.css"; // Import custom Swiper styles

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
  onNext: (selectedPackageId: string | null) => void; // Callback to send the selected package ID to the parent
  onBackClick: () => void; // Callback for "Back" button click
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

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCardClick = (packageId: string) => {
    setSelectedPackageId(packageId); // Set the selected package ID
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  if (error) return <p>Failed to load packages</p>;

  const packages = (data as { eventPackages: Package[] })?.eventPackages || [];

  return (
    <div className="flex flex-col justify-center gap-4 items-center p-4">
      <div className="text-primary font-bold text-2xl">Choose Package</div>

      <button
        onClick={toggleView}
        className="md:hidden p-2 rounded-lg bg-primary text-gray-100 cursor-pointer"
      >
        {isGridView ? "Switch to List View" : "Switch to Grid View"}
      </button>

      <div className="w-full md:w-2/3 h-full overflow-y-auto">
        {isLoading ? (
          // Loader for Swiper
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : isGridView ? (
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
            {packages.map((eventPackage: Package, index: number) => (
              <SwiperSlide
                key={eventPackage._id || index}
                onClick={() => handleCardClick(eventPackage._id)} // Pass the package ID
                className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                  selectedPackageId === eventPackage._id
                    ? "border-2 border-primary scale-105"
                    : "border border-gray-300"
                }`}
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
                <p className="mt-2 text-sm font-bold text-tertiary text-center">
                  {eventPackage.packageName} - ${eventPackage.packagePrice}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          // List View (1 column)
          <div className="flex flex-col gap-4">
            {packages.map((eventPackage: Package, index: number) => (
              <div
                key={eventPackage._id || index}
                className={`flex flex-col justify-center items-center bg-gray-100 rounded-lg overflow-hidden cursor-pointer p-2 transition-all duration-300 ${
                  selectedPackageId === eventPackage._id
                    ? "border-4 border-primary scale-105"
                    : "border border-gray-300"
                }`}
                onClick={() => handleCardClick(eventPackage._id)} // Pass the package ID
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
                <p className="mt-2 text-sm text-tertiary font-medium text-center">
                  {eventPackage.packageName} - ${eventPackage.packagePrice}
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
          onClick={onBackClick}
          className="p-2 rounded-lg border border-primary text-primary cursor-pointer"
        >
          &lt; Back
        </button>
        <button
          onClick={() => onNext(selectedPackageId)}
          className={`p-2 rounded-lg ${
            selectedPackageId
              ? "bg-primary text-gray-100 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedPackageId} 
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}

export default ChoosePackage;
