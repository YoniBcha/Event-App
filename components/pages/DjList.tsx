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
  onExtraServiceSelect: (data: {
    selectedServices: string[];
    djPackage?: string;
    dancersPackage?: string;
    organizerPackage?: string;
  }) => void;
}

const ChooseExtraService: React.FC<ChooseExtraServiceProps> = ({
  onExtraServiceSelect,
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<
    "services" | "dj" | "dancers" | "organizer"
  >("services");
  const [djPackage, setDjPackage] = useState<string | null>(null);
  const [dancersPackage, setDancersPackage] = useState<string | null>(null);
  const [organizerPackage, setOrganizerPackage] = useState<string | null>(null);

  const {
    data: extraServicesResponse,
    isLoading,
    isError,
  } = useGetExtraServiceQuery();

  const handleCardClick = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices((prev) =>
        prev.filter((serviceId) => serviceId !== id)
      );
    } else {
      setSelectedServices((prev) => [...prev, id]);
    }
    setCurrentStep(id as "dj" | "dancers" | "organizer"); // Set the current step based on the selected service
  };

  const handleNextClick = () => {
    console.log("Selected Services:", selectedServices);
    console.log("Current Step:", currentStep);

    if (selectedServices.length === 0) {
      console.error("No services selected.");
      return;
    }

    onExtraServiceSelect({
      selectedServices,
      djPackage: djPackage || undefined,
      dancersPackage: dancersPackage || undefined,
      organizerPackage: organizerPackage || undefined,
    });
  };

  const handleBackClick = () => {
    setCurrentStep("services"); // Go back to services
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !extraServicesResponse?.status) {
    return <div>Error fetching extra services.</div>;
  }

  const services = extraServicesResponse.extraServices;

  return (
    <div className="">
 
      <div className="flex flex-row justify-center gap-5 mt-5 md:mt-10">
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

      {currentStep === "dj" && (
        <div className="mt-10">
          <h2>Select DJ Package</h2>
          <input
            type="text"
            placeholder="Select DJ Package"
            value={djPackage || ""}
            onChange={(e) => setDjPackage(e.target.value)}
          />
        </div>
      )}

      {currentStep === "dancers" && (
        <div className="mt-10">
          <h2>Select Dancers Package</h2>
          <input
            type="text"
            placeholder="Select Dancers Package"
            value={dancersPackage || ""}
            onChange={(e) => setDancersPackage(e.target.value)}
          />
        </div>
      )}

      {currentStep === "organizer" && (
        <div className="mt-10">
          <h2>Select Organizer Package</h2>
          <input
            type="text"
            placeholder="Select Organizer Package"
            value={organizerPackage || ""}
            onChange={(e) => setOrganizerPackage(e.target.value)}
          />
        </div>
      )}

      <div className="flex flex-row justify-center gap-5 mt-5 md:mt-10">
        {currentStep !== "services" && (
          <div
            className="p-2 rounded-lg border border-primary text-primary cursor-pointer"
            onClick={handleBackClick}
          >
            &lt; Back
          </div>
        )}
        <div
          className={`p-2 rounded-lg ${
            selectedServices.length > 0
              ? "bg-primary text-gray-100"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleNextClick}
        >
          {currentStep === "organizer" ? "Done" : "Next &gt;"}
        </div>
      </div>
    </div>
  );
};

export default ChooseExtraService;
