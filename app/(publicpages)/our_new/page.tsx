/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import "./styles.css";

interface RootState {
  language: {
    translations: {
      sidebar: {
        designs: string;
      };
    };
  };
}

interface EventDesign {
  _id: string;
  eventDesign: string;
  translatedEventDesign: string;
  image: string;
  isRemoved: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

function ChooseNewDesigns() {
  const translations = useSelector(
    (state: RootState) => state.language.translations
  );
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const [designs, setDesigns] = useState<EventDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const router = useRouter();

  const renderValue = (
    defaultValue: string,
    translatedValue: string | undefined
  ) => {
    return currentLocale === "ar" && translatedValue
      ? translatedValue
      : defaultValue;
  };

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await fetch(
          "https://fenzoappprod.onrender.com/api/v1/event/getRecentEventDesigns?limit=6"
        );
        if (!response.ok) throw new Error("Failed to fetch designs");

        const data = await response.json();
        setDesigns(data.eventDesigns || []);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const handleImageClick = (id: string) => {
    router.push(`/our_new/${id}`);
  };

  if (error) return <p>Failed to load designs</p>;

  return (
    <div className="flex flex-col gap-4 mb-3">
      <div className="self-center h-[10rem] md:h-[20rem] w-full md:w-[65%] relative">
        <Image
          src={"/Frame 24.png"}
          alt="About Image"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="text-primary font-bold text-xl md:text-3xl pt-5 text-center">
        {translations.sidebar.designs}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 mx-auto md:w-[65%]    min-[500px]:grid-cols-2 [@media(min-width:644px)]:grid-cols-3 gap-6  w-full px-2">
          {designs?.map((design) => (
            <motion.div
              key={design._id}
              className="relative aspect-square w-full h-28 md:h-48 cursor-pointer overflow-hidden shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleImageClick(design._id)}
            >
              <Image
                src={design.image}
                alt={renderValue(
                  design.eventDesign,
                  design.translatedEventDesign
                )}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white font-medium text-sm truncate">
                  {renderValue(
                    design.eventDesign,
                    design.translatedEventDesign
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChooseNewDesigns;
