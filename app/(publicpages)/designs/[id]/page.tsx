/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Image from "next/image";
import { useGetSingleDesignGalleryQuery } from "@/store/endpoints/apiSlice";
import { useParams, useRouter } from "next/navigation"; // Use useParams instead of useSearchParams
import { useSelector } from "react-redux";

export default function DesignPage() {
  const params = useParams(); // Retrieve params
  const router = useRouter();
  const id = params.id as string; // Get the id from params
  const { data: designData, isLoading: isGalleryLoading } =
    useGetSingleDesignGalleryQuery<any>({ id, designId: "" });
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const renderValue = (
    defaultValue: string,
    translatedValue: string | undefined
  ) => {
    return currentLocale === "ar" && translatedValue
      ? translatedValue
      : defaultValue;
  };

  const handleBooking = () => {
    // Get the appropriate title based on current locale
    const designTitle =
      currentLocale === "ar"
        ? designData?.singleGallery?.designId?.translatedEventDesign
        : designData?.singleGallery?.designId?.eventDesign;

    // Save both design id and title as an array in sessionStorage
    const designDataArray = [
      designData?.singleGallery?.designId?._id,
      designTitle || "",
    ];
    sessionStorage.setItem(
      "preSelectedDesign",
      JSON.stringify(designDataArray)
    );

    router.push("/mainpage/1");
  };

  if (isGalleryLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:p-4 p-1">
      {/* Display First Image */}
      {designData?.singleGallery?.images?.[0] && (
        <div className="relative w-full h-64 max-sm:w-full mx-auto lg:w-[50%] max-md:w-[85%] max-lg:w-[70%]">
          <Image
            src={designData.singleGallery.images[0]}
            alt="First Gallery Image"
            fill
            objectFit="cover"
          />
        </div>
      )}
      {/* Title and Description Section */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary">
          {
            renderValue(
              designData?.singleGallery?.designId?.eventDesign,
              designData?.singleGallery?.designId?.translatedEventDesign
            ) // Render the translated value if the current locale is Arabic
          }
        </h1>
        <p className="text-primary mt-2">
          {
            renderValue(
              designData?.singleGallery?.description,
              designData?.singleGallery?.translatedDescription
            ) // Render the translated value if the current locale is Arabic
          }
        </p>
      </div>

      <div className="flex justify-center">
        <div
          onClick={handleBooking}
          className="py-2 px-4 bg-primary hover:bg-secondary text-white rounded-lg text-center cursor-pointer"
        >
          Book Now
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 mb-3 mx-auto max-sm:w-full lg:w-[75%] max-md:w-[85%] max-lg:w-[80%]  min-[350px]:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full sm:px-4">
        {designData?.singleGallery?.images.map(
          (image: string, index: number) => (
            <div
              key={index}
              className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Image
                src={image}
                alt={`Gallery Image ${index + 1}`}
                fill
                objectFit="cover"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
