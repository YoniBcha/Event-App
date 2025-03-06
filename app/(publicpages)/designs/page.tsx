/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";

import "./styles.css";
import { useGetSingleDesignGalleryQuery } from "@/store/endpoints/apiSlice";

interface RootState {
  language: {
    translations: {
      sidebar: {
        designs: string;
      };
    };
  };
}

function ChooseDesigns() {
  const translations = useSelector(
    (state: RootState) => state.language.translations
  );
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);

  const { data: galleryData, isLoading: isGalleryLoading } =
    useGetSingleDesignGalleryQuery<any>(
      { id: selectedDesignId, designId: "" },
      {
        skip: !selectedDesignId, // Skip the query if no design ID is selected
      }
    );

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await fetch(
          "https://eventapp-back-cr86.onrender.com/api/v1/event/getDesignsGallery"
        );
        if (!response.ok) throw new Error("Failed to fetch designs");

        const data = await response.json();
        setDesigns(data.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  // Reload the page once on the first visit
  useEffect(() => {
    const hasReloaded = localStorage.getItem("hasReloaded");
    if (!hasReloaded) {
      window.location.reload();
      localStorage.setItem("hasReloaded", "true");
    }
    return () => {
      // Clean up by removing the flag when the component unmounts
      localStorage.removeItem("hasReloaded");
    };
  }, []);

  const handleImageClick = (id: string) => {
    console.log("Selected Design ID:", id);
    setSelectedDesignId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDesignId(null);
  };

  if (error) return <p>Failed to load designs</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-primary font-bold text-xl md:text-3xl pt-5 text-center">
        {translations.sidebar.designs}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
          {designs.map((design: any, index: number) => (
            <motion.div
              key={design._id || index}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col justify-center items-center bg-gray-100 rounded-lg overflow-hidden cursor-pointer p-2 border border-gray-300 transition-all duration-300"
            >
              <div
                className="relative w-full h-48"
                onClick={() => handleImageClick(design._id)}
              >
                <Image
                  src={design.images[0]}
                  alt={design.designId.eventDesign}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <p className="mt-2 text-sm text-tertiary font-extrabold text-center">
                {design.designId.eventDesign}
              </p>
              <p className="mt-2 text-sm text-tertiary font-medium text-center">
                {design.description}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="relative w-11/12 h-3/4 rounded-lg backdrop-blur-lg bg-secondary p-4 shadow-lg overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-20 text-gray-200 hover:text-primary transition-all"
            >
              <IoMdClose size={28} />
            </button>

            {isGalleryLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Title and Description Section */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-primary">
                    {galleryData.singleGallery.designId.eventDesign}
                  </h2>
                </div>
                {/* Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryData.singleGallery.images.map(
                    (image: any, index: number) => (
                      <div
                        key={index}
                        className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <Image
                          src={image}
                          alt={`Gallery Image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                        <div className="text-center">
                          <h2 className="text-2xl font-bold text-primary">
                            {galleryData.singleGallery.designId.eventDesign}
                          </h2>
                          <p className="text-gray-300 mt-2">
                            {galleryData.singleGallery.description}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChooseDesigns;
