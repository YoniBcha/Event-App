/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Image from "next/image";
import { useGetSingleDesignGalleryQuery } from "@/store/endpoints/apiSlice";
import { useParams } from "next/navigation"; // Use useParams instead of useSearchParams

export default function DesignPage() {
  const params = useParams(); // Retrieve params
  const id = params.id as string; // Get the id from params
  const { data: designData, isLoading: isGalleryLoading } =
    useGetSingleDesignGalleryQuery<any>({ id, designId: "" });

  if (isGalleryLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Title and Description Section */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary">
          {designData?.singleGallery?.designId?.eventDesign}
        </h1>
        <p className="text-primary mt-2">
          {designData?.singleGallery?.description}
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 mb-3 mx-auto lg:w-[75%] max-md:w-[85%] max-lg:w-[80%]  min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full px-4">
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
                className="rounded-lg"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
