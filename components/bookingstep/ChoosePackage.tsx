/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import {
  useGetPackageQuery,
  useGetSingleDesignGalleryQuery,
} from "@/store/endpoints/apiSlice";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/pagination";
import "./swiper-custom.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
  onNext: (selectedPackageId: string | null) => void;
  onBackClick: () => void;
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

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedImage, setSelectedImage] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );

  const [selectedImage, setSelectedImage] = useState<any>("");
  // const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { data: galleryData, isLoading: isGalleryLoading } =
    useGetSingleDesignGalleryQuery<any>(
      { id: "", designId: eventDesign },
      {
        skip: !eventDesign, // Skip the query if no design ID is selected
      }
    );
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const translations = useSelector((state: any) => state.language.translations);
  useEffect(() => {
    if (galleryData?.singleGallery?.images?.length > 0) {
      setSelectedImage(galleryData);
    }
  }, [galleryData]);

  useEffect(() => {
    const selectedPackageId = sessionStorage.getItem("selectedPackageId");
    if (selectedPackageId) {
      setSelectedPackageId(selectedPackageId);
    }
  }, [setSelectedPackageId]);
  // const handleImageClick = (id: string) => {
  //   console.log("Selected Design ID:", id);
  //   setSelectedDesignId(id);
  // };

  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 3000,
  //   arrows: true,
  // };

  // Get images to display

  // useEffect(() => {
  //   const fetchDesigns = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://eventapp-back-cr86.onrender.com/api/v1/event/getDesignsGallery"
  //       );
  //       if (!response.ok) throw new Error("Failed to fetch designs");

  //       const data = await response.json();
  //       setDesigns(data);
  //       console.log(JSON.stringify(data, null, 2));
  //     } catch (error) {
  //       setError(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchDesigns();
  // }, []);

  const cardVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2, ease: "easeInOut" },
      backgroundColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--secondary")
        .trim(),
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1, ease: "easeInOut" },
    },
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !isGridView) {
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

  useEffect(() => {
    if (!galleryData?.singleGallery?.images?.length) return;

    const interval = setInterval(() => {
      setSelectedImageIndex(
        (prevIndex) => (prevIndex + 1) % galleryData.singleGallery.images.length
      );
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [galleryData?.singleGallery?.images, selectedImageIndex]);

  // Handle thumbnail click
  const handleThumbnailClick = (index: any) => {
    setSelectedImageIndex(index);
  };

  // Handle next slide
  const handleNextSlide = () => {
    setSelectedImageIndex(
      (prevIndex) =>
        (prevIndex + 1) % galleryData?.singleGallery?.images?.length
    );
  };

  // Handle previous slide
  const handlePrevSlide = () => {
    setSelectedImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + galleryData?.singleGallery?.images?.length) %
        galleryData?.singleGallery?.images?.length
    );
  };
  const handleCardClick = (packageId: string) => {
    setSelectedPackageId(packageId);
  };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedImage("");
  // };

  // const toggleView = () => {
  //   setIsGridView(!isGridView);
  // };

  if (error) return <p>Failed to load packages</p>;

  const packages = (data as { eventPackages: Package[] })?.eventPackages || [];

  // Check if there are no packages
  if (!isLoading && packages?.length === 0) {
    return (
      <motion.div
        className="flex flex-col gap-10 h-full justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-primary font-bold text-xl md:text-3xl text-center">
          {translations.booking.noPackage}
        </div>

        {/* Back Button */}
        <motion.button
          onClick={onBackClick}
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
        </motion.button>
      </motion.div>
    );
  }

  // const imageVariants = {
  //   hidden: { opacity: 0, scale: 0.9 },
  //   visible: { opacity: 1, scale: 1 },
  // };

  // const CustomPrevArrow = (props: any) => (
  //   <div
  //     className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 cursor-pointer bg-black/50 rounded-full p-1 hover:bg-secondary"
  //     onClick={props.onClick}
  //   >
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="white"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     >
  //       <path d="M15 18l-6-6 6-6" />
  //     </svg>
  //   </div>
  // );

  // const CustomNextArrow = (props: any) => (
  //   <div
  //     className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 cursor-pointer bg-black/50 rounded-full p-1 hover:bg-secondary"
  //     onClick={props.onClick}
  //   >
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       width="24"
  //       height="24"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="white"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     >
  //       <path d="M9 18l6-6-6-6" />
  //     </svg>
  //   </div>
  // );
  return (
    <div className="flex flex-col justify-center items-center gap-4 h-full">
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex-grow flex flex-col justify-center items-center w-full h-full mt-6 md:mt-0">
          <div className="text-primary font-bold text-xl md:text-3xl py-5">
            Designs Details
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div
              className="flex flex-col gap-3 md:flex-row bg-gradient-to-r from-secondary to-white w-full max-[550px]:w-full max-lg:w-4/5 md:w-[85%] lg:w-3/4 h-fit max-md:bg-transparent p-3 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col w-full md:w-1/2 h-full">
                <div className="flex flex-col w-full">
                  {/* Slider Container */}
                  {isGalleryLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="w-full rounded bg-transparent flex items-center justify-center relative overflow-hidden">
                      <div className="w-full h-[300px] relative">
                        {/* Framer Motion Slide Effect */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedImageIndex}
                            initial={{ opacity: 0, x: 100 }} // Slide in from the right
                            animate={{ opacity: 1, x: 0 }} // Center the slide
                            exit={{ opacity: 0, x: -100 }} // Slide out to the left
                            transition={{ duration: 0.5 }}
                            className="absolute w-full h-full"
                          >
                            <Image
                              src={
                                galleryData?.singleGallery?.images[
                                  selectedImageIndex
                                ]
                              }
                              alt={`Slide ${selectedImageIndex}`}
                              fill
                              className="object-cover rounded"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              priority
                            />
                          </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <button
                          aria-label="previous slide"
                          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-primary hover:bg-secondary rounded-full w-6 h-6 flex items-center justify-center"
                          onClick={handlePrevSlide}
                        >
                          <FaChevronLeft size={16} className="text-lg" />{" "}
                          {/* Use React Icon */}
                        </button>

                        <button
                          aria-label="next slide"
                          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-primary hover:bg-secondary rounded-full w-6 h-6 flex items-center justify-center"
                          onClick={handleNextSlide}
                        >
                          <FaChevronRight size={16} className="text-lg" />{" "}
                          {/* Use React Icon */}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnail Grid */}
                <div className="py-2 grid grid-cols-4 gap-2">
                  {galleryData?.singleGallery?.images?.map(
                    (imgSrc: any, index: any) => (
                      <motion.div
                        key={index}
                        className={`rounded cursor-pointer ${
                          selectedImageIndex === index
                            ? "border-2 border-primary"
                            : ""
                        } overflow-hidden relative w-full h-12 md:h-11`}
                        onClick={() => handleThumbnailClick(index)} // Update the selected image index
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src={imgSrc}
                          alt={`Thumbnail ${index}`}
                          fill
                          className="object-cover rounded"
                          priority
                        />
                      </motion.div>
                    )
                  )}
                </div>
              </div>
              <motion.div
                className="w-full md:w-1/2 h-full ml-0 md:ml-5 mt-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <h3 className="text-xl flex items-center font-semibold">
                    {selectedImage?.singleGallery?.designId.eventDesign}
                  </h3>
                  <div
                    className="mt-2 p-2 text-sm md:text-base overflow-hidden"
                    style={{ wordWrap: "break-word" }}
                    dangerouslySetInnerHTML={{
                      __html: selectedImage?.singleGallery?.description.replace(
                        /\n/g,
                        "<br />"
                      ),
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
      <div className="text-primary font-bold text-2xl md:text-3xl pt-5 text-center">
        {translations.booking.choosePackage}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* List View for Small Devices (sm and below) */}
          <div className="flex w-full sm:hidden flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 [@media(min-width:361px)]:grid-cols-2 [@media(min-width:639px)]:grid-cols-2">
              {packages.map((eventPackage: Package, index: number) => (
                <motion.div
                  key={eventPackage._id || index}
                  className={`flex flex-col justify-center items-center bg-gray-100 rounded-lg overflow-hidden cursor-pointer p-2 transition-all duration-300 ${
                    selectedPackageId === eventPackage._id
                      ? "border-2 border-primary scale-105"
                      : "border border-gray-300"
                  }`}
                  onClick={() => handleCardClick(eventPackage._id)}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div
                    className="relative w-full h-48"
                    onClick={(e) => {
                      e.stopPropagation();
                      // handleImageClick(eventPackage.image[0]);
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
                  <p className="mt-2 text-sm text-tertiary font-medium flex items-center text-center">
                    {eventPackage.packageName} - {eventPackage.packagePrice}{" "}
                    <Image
                      src="/images/SR.png"
                      alt="SR"
                      width={20}
                      height={20}
                      className={currentLocale === "ar" ? "scale-x-[-1]" : ""}
                    />
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Swiper for Medium Devices (md and above) */}
          <div className="hidden sm:block w-[90%] px-4 relative">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ type: "fraction", el: ".swiper-pagination" }}
              navigation={{
                nextEl: ".swiper-button-next", // Custom next button selector
                prevEl: ".swiper-button-prev", // Custom previous button selector
              }}
              breakpoints={{
                640: { slidesPerView: 3 }, // For tablets)
                1024: { slidesPerView: 4 }, // For desktops)
              }}
            >
              {packages.map((eventPackage: Package, index: number) => (
                <SwiperSlide
                  key={eventPackage._id || index}
                  onClick={() => handleCardClick(eventPackage._id)}
                >
                  <motion.div
                    className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                      selectedPackageId === eventPackage._id
                        ? "border-2 border-primary scale-105"
                        : "border border-gray-300"
                    }`}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <div
                      className="relative w-full h-64"
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleImageClick(eventPackage.image[0]);
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
                    <div className="mt-2 text-sm flex flex-row font-bold text-tertiary items-center text-center">
                      {eventPackage.packageName} - {eventPackage.packagePrice}
                      <span className="mx-1 pt-[0.2rem]">
                        <Image
                          src="/images/SR.png"
                          alt="SR"
                          width={12}
                          height={10}
                          className={
                            currentLocale === "ar" ? "scale-x-[-1]" : ""
                          }
                        />
                      </span>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
              <div className="swiper-pagination mt-2"></div>
              {/* Custom Navigation Buttons */}
            </Swiper>
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </div>
        </>
      )}

      {/* Modal for Enlarged Image */}
      {/* <AnimatePresence>
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
      </AnimatePresence> */}

      <div className="flex justify-center gap-5 my-5">
        {/* Back Button */}
        <motion.button
          onClick={onBackClick}
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
        </motion.button>

        {/* Next Button */}
        <motion.button
          onClick={() => onNext(selectedPackageId)}
          disabled={!selectedPackageId}
          className={`next-btn flex items-center p-2 rounded-lg text-white cursor-pointer ${
            selectedPackageId
              ? "bg-primary hover:bg-secondary hover:text-primary"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
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
          whileHover={selectedPackageId ? "hover" : {}}
          whileTap={selectedPackageId ? "tap" : {}}
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
    </div>
  );
}

export default ChoosePackage;
