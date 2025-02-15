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
  const [selectedDj, setSelectedDj] = useState<any>(null);
  const [djPackages, setDjPackages] = useState<any[]>([]);

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

  const handleServiceProviderSelect = (category: string, provider: any) => {
    const updatedServiceProviders = { ...selectedServiceProviders };
    if (!updatedServiceProviders[category]) {
      updatedServiceProviders[category] = [];
    }
    if (updatedServiceProviders[category].includes(provider.providerName)) {
      updatedServiceProviders[category] = updatedServiceProviders[
        category
      ].filter((p) => p !== provider.providerName);
      const updatedPackages = { ...selectedPackages };
      if (updatedPackages[category]?.[provider.providerName]) {
        delete updatedPackages[category][provider.providerName];
      }
      setSelectedPackages(updatedPackages);
    } else {
      updatedServiceProviders[category].push(provider.providerName);
      setSelectedDj(provider); // Set the selected DJ
      fetchDjPackages(provider._id); // Fetch packages for the selected DJ
    }
    setSelectedServiceProviders(updatedServiceProviders);
  };

  const fetchDjPackages = (djId: string) => {
    fetch(
      `https://eventapp-back-cr86.onrender.com/api/v1/event/getSingleServiceProvider/${djId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setDjPackages(data.data.packageList || []); // Update to use `data.data.packageList`
        }
      })
      .catch((error) => console.error("Error fetching DJ packages:", error));
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

          <div className="flex justify-center items-center mt-5 md:mt-10">
            <button
              onClick={handleNext}
              disabled={selectedCategories.length === 0}
              className="text-center mt-2 bg-primary font-medium text-white text-lg border border-primary rounded-lg px-6 py-1"
            >
              Next
            </button>
          </div>
        </>
      )}

      {!showFinalPackages && currentStep === 1 && currentCategory && (
        <div className="flex flex-col gap-5 justify-center items-center mt-5 md:mt-10">
          <h2 className="text-center mt-2 text-primary font-bold text-lg">
            Select {currentCategory}
          </h2>
          <ul className="flex justify-center items-center gap-8">
            {djList.map((dj, index) => (
              <div key={index} className="px-6 py-5 rounded-3xl shadow-lg">
                <div className="relative h-36 w-36 rounded-full">
                  <Image src={dj.profile} alt="hj" fill objectFit="cover" />
                </div>
                <li className="flex items-center justify-center gap-2">
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
                      handleServiceProviderSelect(currentCategory, dj)
                    }
                  />
                  <label
                    htmlFor={dj._id}
                    className="text-center mt-2 text-primary font-bold text-lg"
                  >
                    {dj.providerName}
                  </label>
                  {/* Update Profile Button */}
                  <button
                    onClick={() => {
                      // Add functionality to update the profile
                      console.log("Update profile for:", dj.providerName);
                    }}
                    className="text-sm text-blue-500 underline"
                  >
                    Update Profile
                  </button>
                </li>
              </div>
            ))}
          </ul>
          <div className="flex gap-5 mt-5">
            <button
              onClick={handleBack}
              className="text-center mt-2 text-primary font-medium text-lg border border-primary rounded-lg px-6 py-1"
            >
              Back
            </button>
            <button
              className="text-center mt-2 bg-primary font-medium text-white text-lg border border-primary rounded-lg px-6 py-1"
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
          <div className="flex flex-col gap-5 justify-center items-center mt-5 md:mt-10">
            <h2 className="text-center mt-2 text-primary font-bold text-lg">
              Select Packages for {currentCategory}
            </h2>
            {selectedDj && (
              <div>
                <h3 className="text-center mt-2 text-primary font-bold text-lg">
                  {selectedDj.providerName}
                </h3>
                <ul className="flex flex-col gap-3">
                  {djPackages.map((pkg, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="relative h-20 w-20">
                        <Image
                          src={pkg.packageLogo}
                          alt={pkg.packageName}
                          fill
                          objectFit="cover"
                        />
                      </div>
                      <div>
                        <p className="text-primary font-bold text-lg">
                          {pkg.packageName}
                        </p>
                        <p className="text-primary text-sm">
                          {pkg.packageDescription}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        id={pkg._id}
                        name="package"
                        value={pkg.packageName}
                        checked={
                          selectedPackages[currentCategory]?.[
                            selectedDj.providerName
                          ]?.includes(pkg.packageName) || false
                        }
                        onChange={() =>
                          handlePackageSelect(
                            currentCategory,
                            selectedDj.providerName,
                            pkg.packageName
                          )
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-5 mt-5">
              <button
                onClick={handleBack}
                className="text-center mt-2 text-primary font-medium text-lg border border-primary rounded-lg px-6 py-1"
              >
                Back
              </button>
              {currentCategoryIndex < selectedCategories.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="text-center mt-2 bg-primary font-medium text-white text-lg border border-primary rounded-lg px-6 py-1"
                >
                  Next Category
                </button>
              ) : (
                <button
                  onClick={() => setShowFinalPackages(true)}
                  className="text-center mt-2 bg-primary font-medium text-white text-lg border border-primary rounded-lg px-6 py-1"
                >
                  Submit
                </button>
              )}
            </div>
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
