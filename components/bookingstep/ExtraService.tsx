"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useGetExtraServiceQuery } from "@/store/endpoints/apiSlice";

interface CategoryCardProps {
  imageSrc: string;
  altText: string;
  category: string;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  imageSrc,
  altText,
  category,
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
      <div className="text-primary text-center font-bold mt-2">{category}</div>
    </div>
  );
};

interface Categories {
  [key: string]: {
    [key: string]: string[];
  };
}

const ParentComponent: React.FC<{ extraServices: any[] }> = ({
  extraServices,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedServiceProviders, setSelectedServiceProviders] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedPackages, setSelectedPackages] = useState<{
    [key: string]: { [key: string]: string[] };
  }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showFinalPackages, setShowFinalPackages] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [djList, setDjList] = useState<any[]>([]);

  const categories: Categories = extraServices.reduce((acc, service) => {
    acc[service.serviceName] = {
      [`${service.serviceName} 1`]: [
        `${service.serviceName} 1 Package 1`,
        `${service.serviceName} 1 Package 2`,
      ],
      [`${service.serviceName} 2`]: [
        `${service.serviceName} 2 Package 1`,
        `${service.serviceName} 2 Package 2`,
      ],
    };
    return acc;
  }, {} as Categories);

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
      const updatedServiceProviders = { ...selectedServiceProviders };
      const updatedPackages = { ...selectedPackages };
      delete updatedServiceProviders[category];
      delete updatedPackages[category];
      setSelectedServiceProviders(updatedServiceProviders);
      setSelectedPackages(updatedPackages);
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleServiceProviderSelect = (category: string, provider: string) => {
    const updatedServiceProviders = { ...selectedServiceProviders };
    if (!updatedServiceProviders[category]) {
      updatedServiceProviders[category] = [];
    }
    if (updatedServiceProviders[category].includes(provider)) {
      updatedServiceProviders[category] = updatedServiceProviders[
        category
      ].filter((p) => p !== provider);
      const updatedPackages = { ...selectedPackages };
      if (updatedPackages[category]?.[provider]) {
        delete updatedPackages[category][provider];
      }
      setSelectedPackages(updatedPackages);
    } else {
      updatedServiceProviders[category].push(provider);
    }
    setSelectedServiceProviders(updatedServiceProviders);
  };

  const handlePackageSelect = (
    category: string,
    provider: string,
    packageOption: string
  ) => {
    const updatedPackages = { ...selectedPackages };
    if (!updatedPackages[category]) {
      updatedPackages[category] = {};
    }
    if (!updatedPackages[category][provider]) {
      updatedPackages[category][provider] = [];
    }
    if (updatedPackages[category][provider].includes(packageOption)) {
      updatedPackages[category][provider] = updatedPackages[category][
        provider
      ].filter((pkg) => pkg !== packageOption);
    } else {
      updatedPackages[category][provider].push(packageOption);
    }
    setSelectedPackages(updatedPackages);
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentCategory(selectedCategories[currentStep]);
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (currentCategoryIndex < selectedCategories.length - 1) {
        setCurrentCategory(selectedCategories[currentCategoryIndex + 1]);
        setCurrentStep(1);
      } else {
        setShowFinalPackages(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      setCurrentStep(0);
      setCurrentCategory(null);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const currentCategoryIndex = selectedCategories.indexOf(
    currentCategory || ""
  );

  useEffect(() => {
    if (currentCategory) {
      const categoryId = extraServices.find(
        (service) => service.serviceName === currentCategory
      )?._id;
      if (categoryId) {
        fetch(
          `https://eventapp-back-cr86.onrender.com/api/v1/event/getExtraServiceProviders/${categoryId}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.status) {
              setDjList(data.servicesProviders);
            }
          })
          .catch((error) => console.error("Error fetching DJ list:", error));
      }
    }
  }, [currentCategory, extraServices]);

  return (
    <div className="w-full">
      <h1 className="text-primary text-2xl text-center">
        Choose Extra Services
      </h1>

      {!showFinalPackages && currentStep === 0 && (
        <>
          <div className="flex items-center justify-center gap-10 mt-10">
            {extraServices.map((service, index) => (
              <div key={index} className="">
                <CategoryCard
                  imageSrc={service.image}
                  altText={service.serviceName}
                  category={service.serviceName}
                  isSelected={selectedCategories.includes(service.serviceName)}
                  onClick={() => handleCategorySelect(service.serviceName)}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={selectedCategories.length === 0}
          >
            Next
          </button>
        </>
      )}

      {!showFinalPackages && currentStep === 1 && currentCategory && (
        <div className="flex flex-col justify-center items-center bg-red-500 mt-5 md:mt-16">
          <h2>Select {currentCategory}</h2>
          <ul className="flex justify-center items-center gap-8">
            {djList.map((dj, index) => (
              <div key={index} className="bg-green-500 px-6 py-5 rounded-3xl">
                <div className="relative h-36 w-36 rounded-full">
                  <Image src={dj.profile} alt="hj" fill objectFit="cover" />
                </div>
                <li className="flex gap-2">
                  <input
                    type="checkbox"
                    id={dj._id}
                    name="provider"
                    value={dj.providerName}
                    checked={
                      selectedServiceProviders[currentCategory]?.includes(
                        dj.providerName
                      ) || false
                    }
                    onChange={() =>
                      handleServiceProviderSelect(
                        currentCategory,
                        dj.providerName
                      )
                    }
                  />
                  <label htmlFor={dj._id}>{dj.providerName}</label>
                </li>
              </div>
            ))}
          </ul>
          <div className="flex">
            <button onClick={handleBack}>Back</button>
            <button
              onClick={handleNext}
              disabled={!selectedServiceProviders[currentCategory]?.length}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {!showFinalPackages &&
        currentStep === 2 &&
        currentCategory &&
        selectedServiceProviders[currentCategory]?.length > 0 && (
          <div>
            <h2>Select Packages for {currentCategory}</h2>
            {selectedServiceProviders[currentCategory].map((provider) => (
              <div key={provider}>
                <h3>{provider}</h3>
                <ul>
                  {categories[currentCategory][provider].map(
                    (packageOption, index) => (
                      <li key={index}>
                        <input
                          type="checkbox"
                          id={packageOption}
                          name="package"
                          value={packageOption}
                          checked={
                            selectedPackages[currentCategory]?.[
                              provider
                            ]?.includes(packageOption) || false
                          }
                          onChange={() =>
                            handlePackageSelect(
                              currentCategory,
                              provider,
                              packageOption
                            )
                          }
                        />
                        <label htmlFor={packageOption}>{packageOption}</label>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
            <button onClick={handleBack}>Back</button>
            {currentCategoryIndex < selectedCategories.length - 1 ? (
              <button onClick={handleNext}>Next Category</button>
            ) : (
              <button onClick={() => setShowFinalPackages(true)}>Submit</button>
            )}
          </div>
        )}

      {showFinalPackages && (
        <div>
          <h2>Final Selected Packages:</h2>
          {selectedCategories.map((category) => (
            <div key={category}>
              <h3>{category} Packages:</h3>
              {Object.keys(selectedPackages[category] || {}).map((provider) => (
                <div key={provider}>
                  <h4>{provider}:</h4>
                  <ul>
                    {selectedPackages[category][provider].map(
                      (packageOption, index) => (
                        <li key={index}>{packageOption}</li>
                      )
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ))}
          <button onClick={() => setShowFinalPackages(false)}>Go Back</button>
        </div>
      )}
    </div>
  );
};

const ExtraServicesPage: React.FC = () => {
  const { data, error, isLoading } = useGetExtraServiceQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading extra services</div>;

  return <ParentComponent extraServices={data?.extraServices || []} />;
};

export default ExtraServicesPage;
