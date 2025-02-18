/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGetPackageDetailQuery } from "@/store/endpoints/apiSlice"; // Import the Redux query

function PackageDetails({
  packageId,
  onNextClick,
  onBack,
}: {
  packageId: any;
  onNextClick: any;
  onBack: any;
}) {
  const { data: packageData, isLoading } =
    useGetPackageDetailQuery<any>(packageId);

  const [selectedImage, setSelectedImage] = useState("");

  React.useEffect(() => {
    if (packageData?.eventPackage?.image?.length > 0) {
      setSelectedImage(packageData.eventPackage.image[0]);
    }
  }, [packageData]);

  const handleImageClick = (imageUrl: any) => {
    setSelectedImage(imageUrl);
  };

  const handleNextClick = () => {
    if (onNextClick) {
      onNextClick(packageId);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-4 items-center h-full">
      <div className="text-primary font-bold text-2xl md:text-3xl py-5">
        Package Details
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row bg-[#FDFDF9] w-full md:w-2/3 h-auto md:h-4/5 p-3 rounded-xl">
          <div className="flex flex-col w-full md:w-1/4 h-full">
            <div className="h-[50%] flex flex-col">
              <div className="h-full rounded bg-slate-500 flex items-center justify-center relative">
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    fill
                    className="object-cover rounded"
                    unoptimized
                  />
                ) : (
                  <span>Select an image</span>
                )}
              </div>
            </div>

            <div className="py-2 grid grid-cols-4 gap-2">
              {packageData.eventPackage.image.map(
                (imageUrl: any, index: any) => (
                  <div
                    key={index}
                    className="rounded cursor-pointer overflow-hidden relative w-full h-12 md:h-6"
                    onClick={() => handleImageClick(imageUrl)}
                  >
                    <Image
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )
              )}
            </div>

            <div className="h-14 grid grid-cols-2 gap-2 pt-1">
              {packageData.eventPackage.additions.map(
                (addition: any, index: any) => (
                  <div key={index} className="flex items-center gap-5">
                    <Image
                      src={addition.additionId.logo}
                      width={20}
                      height={20}
                      alt={addition.additionId.additionName}
                    />
                    <div className="text-primary text-sm">
                      {addition.additionId.additionName}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="w-full md:w-3/4 ml-0 md:ml-5 mt-5">
            <div className="mb-6">
              <h3 className="text-xl font-semibold">
                {packageData.eventPackage.packageName}{" "}
                {packageData.eventPackage.packagePrice} SR
              </h3>
              <div
                className="mt-2"
                dangerouslySetInnerHTML={{
                  __html: packageData.eventPackage.description.replace(
                    /\n/g,
                    "<br />"
                  ),
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-5">
        <button
          onClick={onBack}
          className="p-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-gray-100 transition-colors duration-200"
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
        <button
          onClick={handleNextClick}
          className="flex items-center p-2 rounded-lg bg-primary text-gray-100 hover:bg-primary-dark transition-colors duration-200"
        >
          <span>Next</span>
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

export default PackageDetails;
