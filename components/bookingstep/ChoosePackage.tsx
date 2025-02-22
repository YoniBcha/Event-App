"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";
import Image from "next/image";
import { useGetPackageQuery } from "@/store/endpoints/apiSlice";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "./swiper-custom.css";

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
  interface RootState {
    language: {
      translations: {
        booking: {
          choosePackage: string;
          backBtn: string;
          nextBtn: string;
        };
      };
    };
  }

  const translations = useSelector((state: RootState) => state.language.translations);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );

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

  const toggleView = () => {
    setIsGridView(!isGridView);
  };
  const handleBackClick = () => {
    onBackClick();
  };

  if (error) return <p>Failed to load packages</p>;

  const packages = (data as { eventPackages: Package[] })?.eventPackages || [];
   // Check if there are no designs
   if (!isLoading && packages.length === 0) {
    return (
      <div className="flex flex-col gap-10 h-full justify-between items-center">
        <div className="text-primary font-bold text-xl md:text-3xl text-center">
          No Packages Available
        </div>
        <div>
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
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4  h-full">
      <div className="text-primary font-bold text-2xl md:text-3xl pt-5 text-center">
        {translations.booking.choosePackage}
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
                <p className="mt-2 text-sm font-bold text-tertiary text-center">
                  {eventPackage.packageName} - ${eventPackage.packagePrice}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
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
          onClick={onBackClick}
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
          <span>{translations.booking.backBtn}</span>{" "}
        </button>
        <button
          onClick={() => onNext(selectedPackageId)}
          className={`next-btn ${
            selectedPackageId
              ? "bg-primary hover:bg-[#faebdc] hover:text-primary"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!selectedPackageId}
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
          </span>{" "}
        </button>
      </div>
    </div>
  );
}

export default ChoosePackage;
