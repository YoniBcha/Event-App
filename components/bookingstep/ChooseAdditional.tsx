"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGetAdditionalEndpointsQuery } from "@/store/endpoints/apiSlice";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

interface Addition {
  _id: string;
  additionName: string;
  logo: string;
  typeDetail: {
    _id: string;
    typeName: string;
    typePicture: string;
  }[];
}

interface EventPackageAddition {
  additionId: string;
  additionTypeName: string;
  quantity: number;
}

interface ChooseAdditionalProps {
  packageId: string;
  onBack: () => void;
  onSubmit: (data: { eventPackageAdditions: EventPackageAddition[] }) => void;
}

interface PackageAdditionsResponse {
  packageAdditions: Addition[];
}

function ChooseAdditional({ onSubmit, onBack }: ChooseAdditionalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [hasSelection, setHasSelection] = useState<boolean>(false);

  const queryResult = useGetAdditionalEndpointsQuery({});

  const { data, isLoading, isError } = queryResult as {
    data?: PackageAdditionsResponse;
    isLoading: boolean;
    isError: boolean;
  };
  const translations = useSelector((state: { language: { translations: Translations } }) => state.language.translations);

  if (isError) return <div>Error fetching data</div>;

  const packageAdditions: Addition[] =
    data && "packageAdditions" in data ? data.packageAdditions : [];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleQuantityChange = (
    category: string,
    type: string,
    delta: number
  ) => {
    const key = `${category}-${type}`;
    const newQuantity = (quantities[key] || 0) + delta;
    const updatedQuantities = {
      ...quantities,
      [key]: newQuantity < 0 ? 0 : newQuantity,
    };
    setQuantities(updatedQuantities);
    setHasSelection(Object.values(updatedQuantities).some((qty) => qty > 0));
  };

  const handleInputChange = (category: string, type: string, value: number) => {
    const key = `${category}-${type}`;
    const updatedQuantities = { ...quantities, [key]: value < 0 ? 0 : value };
    setQuantities(updatedQuantities);
    setHasSelection(Object.values(updatedQuantities).some((qty) => qty > 0));
  };
  interface Translations {
    booking: {
      backBtn: string;
      nextBtn: string;
      chooseAdditional: string;
    };
  }

  const handleNextClick = () => {
    const eventPackageAdditions: EventPackageAddition[] = Object.keys(
      quantities
    )
      .map((key) => {
        const [additionName, ...typeParts] = key.split("-");
        const typeName = typeParts.join("-");

        const addition = packageAdditions.find(
          (addition) => addition.additionName === additionName
        );

        if (!addition) {
          console.error(`Addition not found: ${additionName}`);
          return null;
        }

        const type = addition.typeDetail.find(
          (type) => type.typeName === typeName
        );

        if (!type) {
          console.error(`Type not found: ${typeName}`);
          return null;
        }

        return {
          additionId: addition._id,
          additionTypeName: typeName,
          quantity: quantities[key],
        };
      })
      .filter(Boolean) as EventPackageAddition[];

    onSubmit({ eventPackageAdditions });
  };

  const handleBackClick = () => {
    onBack();
  };

  const eventPackageAdditional: Addition[] = data?.packageAdditions ?? [];
  if (!isLoading && eventPackageAdditional.length === 0) {
    return (
      <div className="flex flex-col gap-10 h-full justify-center items-center">
        <div className="text-primary font-bold text-xl md:text-3xl text-center">
          No Additionals Available
        </div>
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
          <span>{translations.booking.backBtn}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center h-full w-full">
      <div className="text-primary font-bold text-xl md:text-3xl py-5">
        {translations.booking.chooseAdditional}
      </div>
      <div className="flex flex-col justify-between gap-4 items-center mt-5 md:mt-10 w-full mx-5">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            {packageAdditions.map((addition) => (
              <div
                key={addition._id}
                className="flex flex-col cursor-pointer"
                onClick={() => handleCategoryClick(addition.additionName)}
              >
                <div className="flex flex-row bg-[#faebdc] rounded-lg">
                  <div className="flex items-center justify-center w-1/4 bg-[#eee7de] font-bold rounded-lg">
                    <Image
                      src={addition.logo}
                      width={26}
                      height={26}
                      alt={addition.additionName}
                    />
                  </div>
                  <div className="flex items-center justify-between w-full py-3">
                    <div className="text-primary font-semibold px-7 text-lg">
                      {addition.additionName}
                    </div>
                    <div className="pr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className={`transition-transform duration-200 ${
                          selectedCategory === addition.additionName
                            ? "rotate-180"
                            : ""
                        }`}
                      >
                        <rect width="24" height="24" fill="none" />
                        <path
                          fill="none"
                          stroke="#281d1b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m7 10l5 5m0 0l5-5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedCategory === addition.additionName && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full p-3 mt-2 border-t border-gray-300 shadow-lg rounded-lg"
                    >
                      <div className="flex flex-col gap-2">
                        {addition.typeDetail.map((type) => (
                          <div
                            key={type._id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Image
                                src={type.typePicture}
                                width={20}
                                height={20}
                                alt={type.typeName}
                                className="rounded-full"
                              />
                              <div className="text-primary text-sm">
                                {type.typeName}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                className="px-2 rounded-lg bg-[#faebdc] hover:bg-primary hover:text-white text-gray-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(
                                    addition.additionName,
                                    type.typeName,
                                    -1
                                  );
                                }}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                className="w-12 text-center border rounded-lg"
                                value={
                                  quantities[
                                    `${addition.additionName}-${type.typeName}`
                                  ] || 0
                                }
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleInputChange(
                                    addition.additionName,
                                    type.typeName,
                                    parseInt(e.target.value, 10)
                                  );
                                }}
                                onFocus={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button
                                className="px-2 rounded-lg bg-[#faebdc] hover:bg-primary hover:text-white text-gray-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(
                                    addition.additionName,
                                    type.typeName,
                                    1
                                  );
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-row gap-5 my-2 md:mt-10">
          <button
            onClick={onBack}
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
            <span>{translations.booking.backBtn}</span>
          </button>
          <button
          className={`next-btn ${
            hasSelection
              ? "bg-primary hover:bg-[#faebdc] hover:text-primary"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!hasSelection}
            onClick={handleNextClick}
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
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChooseAdditional;