"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGetExtraServiceQuery } from "@/store/endpoints/apiSlice";

interface ServiceCardProps {
  imageSrc: string;
  altText: string;
  serviceName: string;
  isSelected: boolean;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  imageSrc,
  altText,
  serviceName,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`bg-[#FDFDF9] rounded-3xl px-6 py-3 cursor-pointer ${
        isSelected ? "shadow-lg border-b-2 border-primary" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative rounded-full h-28 w-28 bg-[#c2937b]">
        <Image src={imageSrc} layout="fill" objectFit="contain" alt={altText} />
      </div>
      <div className="text-primary text-center font-bold mt-2">
        {serviceName}
      </div>
    </div>
  );
};

interface ChooseExtraServiceProps {
  onExtraServiceSelect: (services: string[]) => void;
}

const ChooseExtraService: React.FC<ChooseExtraServiceProps> = ({
  onExtraServiceSelect,
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Fetch extra services using Redux Toolkit Query
  const {
    data: extraServicesResponse,
    isLoading,
    isError,
  } = useGetExtraServiceQuery();

  const handleCardClick = (id: string) => {
    if (selectedServices.includes(id)) {
      // If already selected, remove it
      setSelectedServices((prev) =>
        prev.filter((serviceId) => serviceId !== id)
      );
    } else {
      // If not selected, add it
      setSelectedServices((prev) => [...prev, id]);
    }
  };

  const handleNextClick = () => {
    if (selectedServices.length > 0) {
      onExtraServiceSelect(selectedServices);
    }
  };

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (isError || !extraServicesResponse?.status) {
    return <div>Error fetching extra services.</div>;
  }

  // Extract services from the API response
  const services = extraServicesResponse.extraServices;

  return (
    <div className="h-screen">
      <div className="text-primary text-center font-semibold text-3xl">
        Choose Extra Services
      </div>
      <div className="flex flex-col justify-between h-[65vh] gap-4 items-start md:items-center mt-5 md:mt-10">
        <div className="h-[30%] w-full flex items-center justify-center gap-5">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              imageSrc={service.image}
              altText={service.serviceName}
              serviceName={service.serviceName}
              isSelected={selectedServices.includes(service._id)}
              onClick={() => handleCardClick(service._id)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-center gap-5">
        <div className="p-2 rounded-lg border border-primary text-primary">
          &lt; Back
        </div>
        <div
          className={`p-2 rounded-lg ${
            selectedServices.length > 0
              ? "bg-primary text-gray-100"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={selectedServices.length > 0 ? handleNextClick : undefined}
        >
          Next &gt;
        </div>
      </div>
    </div>
  );
};

export default ChooseExtraService;
