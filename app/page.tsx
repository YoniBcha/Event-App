/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useGetBestSellingPackagesQuery,
  useGetPackageDetailQuery,
} from "@/store/endpoints/apiSlice";
import Link from "next/link";

const Home: React.FC = () => {
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const translations = useSelector((state: any) => state.language.translations);
  const { data } = useGetBestSellingPackagesQuery({}) as any;
  const router = useRouter();

  // State for modals
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    alt: string;
  } | null>(null);

  // Fetch package details when a package is selected
  const { data: packageDetail } = useGetPackageDetailQuery(
    selectedPackage?.packageId,
    { skip: !selectedPackage }
  ) as any;

  const packageData = packageDetail?.eventPackage;

  // Collect all images from the package for the image viewer
  const getAllPackageImages = () => {
    const images: { url: string; alt: string }[] = [];

    // Package main images
    if (packageData?.image?.length > 0) {
      packageData.image.forEach((img: string, index: number) => {
        images.push({
          url: img,
          alt: `Package image ${index + 1}`,
        });
      });
    }

    // Event Type images
    if (packageData?.TypeAndDesign?.length > 0) {
      packageData.TypeAndDesign.forEach((typeDesign: any) => {
        // Event Type image
        if (typeDesign.eventType?.image) {
          images.push({
            url: typeDesign.eventType.image,
            alt: typeDesign.eventType.nameOfEvent || "Event Type",
          });
        }

        // Event Design images
        if (typeDesign.eventDesign?.length > 0) {
          typeDesign.eventDesign.forEach((design: any) => {
            if (design.image) {
              images.push({
                url: design.image,
                alt: design.eventDesign || "Event Design",
              });
            }
          });
        }
      });
    }

    // Addition images
    if (packageData?.additions?.length > 0) {
      packageData.additions.forEach((addition: any) => {
        // Addition logo
        if (addition.additionId?.logo) {
          images.push({
            url: addition.additionId.logo,
            alt: addition.additionId.additionName || "Addition",
          });
        }

        // Addition type detail images
        if (addition.additionId?.typeDetail?.length > 0) {
          addition.additionId.typeDetail.forEach((detail: any) => {
            if (detail.typePicture) {
              images.push({
                url: detail.typePicture,
                alt: detail.typeName || "Addition Detail",
              });
            }
          });
        }
      });
    }

    return images;
  };

  const allPackageImages = getAllPackageImages();
  const currentImageIndex = selectedImage
    ? allPackageImages.findIndex((img) => img.url === selectedImage.url)
    : -1;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const imageViewerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  // Handle package click
  const handlePackageClick = (item: any) => {
    console.log("selected package id", { item });
    setSelectedPackage(item);
    setIsModalOpen(true);
  };

  // Handle image click anywhere in the package modal
  const handleImageClick = (imageUrl: string, altText: string) => {
    setSelectedImage({ url: imageUrl, alt: altText });
  };

  // Close package modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
    setSelectedImage(null);
  };

  // Close image viewer
  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  // Navigate to next/previous image
  const navigateImage = (direction: "next" | "prev") => {
    if (!selectedImage || allPackageImages.length === 0) return;

    const currentIndex = allPackageImages.findIndex(
      (img) => img.url === selectedImage.url
    );
    let newIndex;

    if (direction === "next") {
      newIndex =
        currentIndex === allPackageImages.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex =
        currentIndex === 0 ? allPackageImages.length - 1 : currentIndex - 1;
    }

    setSelectedImage(allPackageImages[newIndex]);
  };

  // Search Icon Component
  const SearchIcon = () => (
    <svg
      className="w-8 h-8 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7"
      />
    </svg>
  );

  return (
    <motion.div
      className="w-full flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Mobile banner images */}
      <div className="w-full md:hidden flex gap-2 justify-evenly">
        <motion.div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/b3.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={imageVariants}
        ></motion.div>
        <motion.div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/b1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={imageVariants}
        ></motion.div>
        <motion.div
          className="w-1/3 h-80"
          style={{
            backgroundImage: "url('/b2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={imageVariants}
        ></motion.div>
      </div>

      {/* Main content area */}
      <div className="w-full flex flex-col md:flex-row">
        {/* Left content with header and buttons */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col gap-3 text-start items-start md:justify-center px-4 md:px-8"
          variants={containerVariants}
        >
          <motion.div className="text-start py-3" variants={itemVariants}>
            {translations.welcome}
          </motion.div>

          <div className="w-full flex justify-between items-center">
            <motion.div
              className="text-5xl text-primary max-sm:text-3xl font-bold"
              variants={itemVariants}
            >
              {translations.fenzo}
            </motion.div>
            <motion.button
              className="p-2 text-gray-100 bg-primary mr-14 self-start hover:bg-secondary hover:text-primary rounded"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/mainpage/1")}
            >
              {translations.startJourney}
            </motion.button>
          </div>

          <motion.div variants={itemVariants}>
            {translations.subTitle1}
          </motion.div>
          <motion.div variants={itemVariants}>
            {translations.subTitle}
          </motion.div>

          {/* Social icons container */}
          <div className="w-full flex justify-around items-center py-9 gap-5 md:gap-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <Image
                src="/images/new.png"
                alt="Events"
                width={85}
                height={85}
              />
              <div className="font-semibold max-md:text-sm text-primary">
                {translations.new}
              </div>
            </div>
            <Link
              href="https://www.instagram.com/fenzo_events"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 text-center"
            >
              <Image
                src="/instagram icon.png"
                alt="Instagram"
                width={80}
                height={80}
              />
              <div className="font-semibold max-md:text-sm text-primary">
                {translations.instagram}
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Desktop banner images */}
        <div className="w-1/2 sm:hidden md:flex flex-row gap-2 mx-3 justify-evenly">
          <motion.div
            className="w-1/3"
            style={{
              backgroundImage: "url('/b2.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            variants={imageVariants}
          ></motion.div>
          <motion.div
            className="w-1/3"
            style={{
              backgroundImage: "url('/b1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            variants={imageVariants}
          ></motion.div>
          <motion.div
            className="w-1/3"
            style={{
              backgroundImage: "url('/b3.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            variants={imageVariants}
          ></motion.div>
        </div>
      </div>

      {/* Best Selling Packages Section */}
      {data?.data?.length > 0 && (
        <motion.div
          className="w-full px-4 md:px-8 mt-8"
          variants={containerVariants}
        >
          <p className="text-primary font-bold mb-6 text-start text-3xl">
            {translations.most_sold}
          </p>

          {/* Grid layout for packages */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {data?.data?.map((item: any, idx: number) => (
                <motion.div
                  key={item.id ?? idx}
                  className="flex flex-col items-center transition cursor-pointer"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handlePackageClick(item)}
                >
                  {/* Image on Top */}
                  {item?.image?.[0] ? (
                    <Image
                      src={item.image[0]}
                      alt={item.title || "package image"}
                      width={1000}
                      height={1000}
                      className="rounded-2xl object-cover w-36 h-36"
                    />
                  ) : (
                    <div className="w-36 h-36 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                  {/* Package Name */}
                  <div className="mt-2 text-sm text-primary font-semibold text-center line-clamp-2">
                    {currentLocale === "en"
                      ? item.packageName
                      : item.translatedPackageName}
                  </div>
                  {/* Package Price */}
                  <div className="mt-1 text-primary text-sm text-center">
                    {item.packagePrice} SAR
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Package Detail Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header - Fixed with proper z-index */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-20 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-primary truncate">
                      {currentLocale === "en"
                        ? packageData?.packageName
                        : packageData?.translatedPackageName}
                    </h2>
                    <p className="text-lg font-semibold text-secondary mt-1">
                      {packageData?.packagePrice} SAR
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100 ml-4"
                    aria-label="Close modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* Package Images with improved gallery and search icon */}
                  {packageData?.image?.length > 0 && (
                    <div className="mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {packageData.image.map((img: string, index: number) => (
                          <div
                            key={index}
                            className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
                            onClick={() =>
                              handleImageClick(
                                img,
                                `Package image ${index + 1}`
                              )
                            }
                          >
                            <Image
                              src={img}
                              alt={`Package image ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                            {/* Search Icon Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-black bg-opacity-50 rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300">
                                <SearchIcon />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description with better formatting */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {translations.description || "Description"}
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {currentLocale === "en"
                          ? packageData?.description
                          : packageData?.translatedDescription}
                      </p>
                    </div>
                  </div>

                  {/* Event Types and Designs with improved layout and search icons */}
                  {packageData?.TypeAndDesign?.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {translations.event_types_and_designs || "Event Types & Designs"}
                      </h3>
                      <div className="space-y-6">
                        {packageData.TypeAndDesign.map(
                          (typeDesign: any, index: number) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow duration-300"
                            >
                              <div className="flex items-center mb-4">
                                {typeDesign.eventType?.image && (
                                  <div
                                    className="w-10 h-10 relative rounded-full overflow-hidden mr-3 cursor-pointer group"
                                    onClick={() =>
                                      handleImageClick(
                                        typeDesign.eventType.image,
                                        typeDesign.eventType.nameOfEvent ||
                                          "Event Type"
                                      )
                                    }
                                  >
                                    <Image
                                      src={typeDesign.eventType.image}
                                      alt={typeDesign.eventType.nameOfEvent}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                                    {/* Search Icon Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <div className="bg-black bg-opacity-60 rounded-full p-1 transform group-hover:scale-110 transition-transform duration-300">
                                        <SearchIcon />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <h4 className="font-semibold text-primary text-lg">
                                  {currentLocale === "en"
                                    ? typeDesign.eventType?.nameOfEvent
                                    : typeDesign.eventType
                                        ?.translatedNameOfEvent}
                                </h4>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {typeDesign.eventDesign.map((design: any) => (
                                  <div
                                    key={design._id}
                                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer group relative"
                                    onClick={() =>
                                      design.image &&
                                      handleImageClick(
                                        design.image,
                                        design.eventDesign || "Event Design"
                                      )
                                    }
                                  >
                                    {design.image && (
                                      <div className="flex-shrink-0 w-8 h-8 relative rounded overflow-hidden group-hover:scale-110 transition-transform duration-300">
                                        <Image
                                          src={design.image}
                                          alt={design.eventDesign}
                                          fill
                                          className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                                        {/* Search Icon Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                          <div className="bg-black bg-opacity-60 rounded-full p-1 transform group-hover:scale-110 transition-transform duration-300">
                                            <svg
                                              className="w-3 h-3 text-white"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7"
                                              />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-700 flex-1">
                                      {currentLocale === "en"
                                        ? design.eventDesign
                                        : design.translatedEventDesign}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Places with better styling */}
                  {packageData?.place?.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {translations.availableLocations || "Available Locations"}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {packageData.place.map(
                          (place: string, index: number) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-medium capitalize shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              {(() => {
                              const p = (place || "").toLowerCase();
                              if (p === "both")
                                return (
                                  translations?.booking?.both ??
                                "Indoor & Outdoor"
                                );
                              if (p === "indoor")
                                return translations?.booking?.inDoor ?? "Indoor";
                              if (p === "outdoor")
                                return translations?.booking?.outDoor ?? "Outdoor";
                              return place;
                              })()}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additions with enhanced cards and search icons */}
                  {packageData?.additions?.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {translations.includedAdditions || "Included Additions"}
                      </h3>
                      <div className="grid gap-4">
                        {packageData.additions.map(
                          (addition: any, index: number) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-xl p-4 hover:border-primary transition-all duration-300 hover:shadow-md bg-white"
                            >
                              <div className="flex items-start space-x-4">
                                {addition.additionId?.logo && (
                                  <div
                                    className="flex-shrink-0 w-14 h-14 relative bg-white rounded-lg border border-gray-200 p-2 cursor-pointer group"
                                    onClick={() =>
                                      handleImageClick(
                                        addition.additionId.logo,
                                        addition.additionId.additionName ||
                                          "Addition"
                                      )
                                    }
                                  >
                                    <Image
                                      src={addition.additionId.logo}
                                      alt={addition.additionId.additionName}
                                      fill
                                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg" />
                                    {/* Search Icon Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <div className="bg-black bg-opacity-60 rounded-full p-1 transform group-hover:scale-110 transition-transform duration-300">
                                        <svg
                                          className="w-4 h-4 text-white"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold text-primary text-lg mb-1">
                                        {currentLocale === "en"
                                          ? addition.additionId?.additionName
                                          : addition.additionId
                                              ?.translatedAdditionName}
                                      </h4>
                                      <p className="text-gray-600 text-sm mb-2">
                                        {addition.typeOfAddition}
                                      </p>
                                    </div>
                                    {addition.quantity && (
                                      <div className="flex-shrink-0 ml-4">
                                        <span className="inline-flex items-center text-white px-3 py-1 rounded-full text-xs font-medium bg-primary bg-opacity-10 text-primary">
                                          ×{addition.quantity}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {addition.additionId?.typeDetail?.[0]
                                    ?.typePicture && (
                                    <div
                                      className="mt-3 relative w-32 h-24 rounded-lg overflow-hidden cursor-pointer group"
                                      onClick={() =>
                                        handleImageClick(
                                          addition.additionId.typeDetail[0]
                                            .typePicture,
                                          addition.additionId.typeDetail[0]
                                            .typeName || "Addition Detail"
                                        )
                                      }
                                    >
                                      <Image
                                        src={
                                          addition.additionId.typeDetail[0]
                                            .typePicture
                                        }
                                        alt={
                                          addition.additionId.typeDetail[0]
                                            .typeName
                                        }
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                                      {/* Search Icon Overlay */}
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-black bg-opacity-60 rounded-full p-2 transform group-hover:scale-110 transition-transform duration-300">
                                          <SearchIcon />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {addition.additionId?.typeDetail?.[0]
                                    ?.typeDescription && (
                                    <p className="text-gray-500 text-sm mt-2">
                                      {currentLocale === "en"
                                        ? addition.additionId.typeDetail[0]
                                            .typeDescription
                                        : addition.additionId.typeDetail[0]
                                            .translatedTypeDescription}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-90 p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeImageViewer}
          >
            <motion.div
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              variants={imageViewerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Close Button */}
              <button
                onClick={closeImageViewer}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200 z-10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image Alt Text */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm max-w-md truncate">
                {selectedImage.alt}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;