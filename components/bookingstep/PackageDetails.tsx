"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetPackageDetailQuery } from "@/store/endpoints/apiSlice"; // Import the Redux query

function PackageDetails({ packageId }) {
  // Fetch package details using Redux Toolkit Query
  const {
    data: packageData,
    isLoading,
    isError,
    error,
  } = useGetPackageDetailQuery(packageId);

  const [selectedImage, setSelectedImage] = useState("");

  // Set the default selected image when data is fetched
  React.useEffect(() => {
    if (packageData?.eventPackage?.image?.length > 0) {
      setSelectedImage(packageData.eventPackage.image[0]);
    }
  }, [packageData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!packageData) {
    return <div>No package data found.</div>;
  }

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="flex flex-col justify-center h-full gap-4 items-center p-4">
      <div className="text-primary font-bold text-2xl md:text-3xl lg:text-4xl text-center">
        Package Details
      </div>
      <div className="flex flex-col md:flex-row bg-[#FDFDF9] w-full md:w-2/3 h-auto md:h-4/5 p-3 rounded-xl">
        {/* Image Gallery Section */}
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
            {packageData.eventPackage.image.map((imageUrl, index) => (
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
            ))}
          </div>

          {/* Additions Section */}
          <div className="h-14 grid grid-cols-2 gap-2 pt-1">
            {packageData.eventPackage.additions.map((addition, index) => (
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
            ))}
          </div>
        </div>

        {/* Package Details Section */}
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

      {/* Navigation Buttons */}
      <div className="flex flex-row gap-5">
        <button className="p-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-gray-100 transition-colors duration-200">
          &lt; Back
        </button>
        <Link href={"/chooseAdditional"}>
          <button className="p-2 rounded-lg bg-primary text-gray-100 hover:bg-primary-dark transition-colors duration-200">
            Next &gt;
          </button>
        </Link>
      </div>
    </div>
  );
}

export default PackageDetails;
