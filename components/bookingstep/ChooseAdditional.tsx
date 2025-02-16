"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGetAdditionalEndpointsQuery } from "@/store/endpoints/apiSlice"; // Import the Redux query

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

  const handleNextClick = () => {
    const eventPackageAdditions: EventPackageAddition[] = Object.keys(quantities)
      .map((key) => {
        const [additionName, typeName] = key.split("-");
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

        console.log("datas in the addinnaldkjf ",)
  
        return {
          additionId: type._id, 
          additionTypeName: typeName, 
          quantity: quantities[key],
        };
      })
      .filter(Boolean) as EventPackageAddition[]; 
      onSubmit({ eventPackageAdditions });
  };

  return (
    <>
      <div className="text-primary text-center font-bold text-4xl">
        Choose Additional
      </div>
      <div className="flex flex-col justify-between gap-4 items-center mt-5 md:mt-10">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full px-20">
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
                  <div className="flex items-center justify-between w-3/4 py-3">
                    <div className="text-primary font-semibold px-7 text-lg">
                      {addition.additionName}
                    </div>
                    <div className="">
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

                {selectedCategory === addition.additionName && (
                  <div className="w-full p-3 mt-2 border-t border-gray-300 shadow-lg rounded-lg">
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
                              className="px-2 rounded-lg bg-gray-200"
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
                              onClick={(e) => e.stopPropagation()} // Prevent click from closing dropdown
                            />
                            <button
                              className="px-2 rounded-lg bg-gray-200"
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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-row gap-5 mt-2 md:mt-10">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-primary text-primary cursor-pointer hover:bg-gray-200 transition"
          >
            &lt; Back
          </button>
          <button
            className={`p-2 rounded-lg text-gray-100 cursor-pointer transition ${
              hasSelection
                ? "bg-primary hover:bg-primary-dark"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!hasSelection}
            onClick={handleNextClick}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </>
  );
}

export default ChooseAdditional;
