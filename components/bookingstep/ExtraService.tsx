/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useGetExtraServiceQuery } from "@/store/endpoints/apiSlice";
import * as Yup from "yup";

interface ExtraServiceProps {
  extraServices: any;
  onExtraServiceSelect: (selectedService: any) => void;
  onBack: () => void; // Add onBack prop for the back button
}

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

interface ServiceProvider {
  _id: string;
  providerName: string;
  profile: string;
}

interface Package {
  _id: string;
  packageName: string;
  packageDescription: string;
  packageLogo: string;
}

interface SelectedData {
  extraServices: {
    servicesProvider_id: string;
    packageName: string;
  }[];
}

interface ParentComponentProps {
  extraServices: any[];
  onExtraServiceSelect: (selectedData: SelectedData) => void;
  onBack: () => void; // Add onBack prop for the back button
}

const validationSchema = Yup.object().shape({
  extraServices: Yup.array()
    .of(
      Yup.object().shape({
        servicesProvider_id: Yup.string().required(
          "Service provider is required"
        ),
        packageName: Yup.string().required("Package is required"),
      })
    )
    .min(1, "At least one service must be selected"),
});

const ParentComponent: React.FC<ParentComponentProps> = ({
  extraServices,
  onExtraServiceSelect,
  onBack,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedServiceProviders, setSelectedServiceProviders] = useState<{
    [key: string]: string;
  }>({});
  const [selectedPackages, setSelectedPackages] = useState<{
    [key: string]: string;
  }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(
    []
  );
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProvider | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const translations = useSelector((state: any) => state.language.translations);

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
    console.log("Selected Categories:", selectedCategories);
  };

  const handleServiceProviderSelect = (
    category: string,
    provider: ServiceProvider
  ) => {
    const updatedServiceProviders = { ...selectedServiceProviders };
    if (updatedServiceProviders[category] === provider._id) {
      delete updatedServiceProviders[category];
      setSelectedProvider(null);
      setPackages([]);
    } else {
      updatedServiceProviders[category] = provider._id; // Store provider ID instead of name
      setSelectedProvider(provider);
      fetchPackages(provider._id);
    }
    setSelectedServiceProviders(updatedServiceProviders);
  };

  const handleDone = async () => {
    const isValid = await validateData();
    if (!isValid) return;

    const selectedData: SelectedData = {
      extraServices: selectedCategories.map((category) => ({
        servicesProvider_id: selectedServiceProviders[category] || "", // This will now contain the provider ID
        packageName: selectedPackages[category] || "",
      })),
    };
    console.log("Selected Data:", selectedData);
    onExtraServiceSelect(selectedData);
  };

  const fetchPackages = (providerId: string) => {
    fetch(
      `https://eventapp-back-cr86.onrender.com/api/v1/event/getSingleServiceProvider/${providerId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setPackages(data.data.packageList || []);
        }
      })
      .catch((error) => console.error("Error fetching packages:", error));
  };

  const handlePackageSelect = (category: string, packageOption: string) => {
    const updatedPackages = { ...selectedPackages };
    if (updatedPackages[category] === packageOption) {
      delete updatedPackages[category];
    } else {
      updatedPackages[category] = packageOption;
    }
    setSelectedPackages(updatedPackages);
  };

  const validateData = async () => {
    try {
      const selectedData = {
        extraServices: selectedCategories.map((category) => ({
          servicesProvider_id: selectedServiceProviders[category] || "",
          packageName: selectedPackages[category] || "",
        })),
      };
      await validationSchema.validate(selectedData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      if (selectedCategories.length === 0) {
        setErrors({ extraServices: "At least one service must be selected" });
        return;
      }
      setCurrentCategory(selectedCategories[0]);
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (!selectedServiceProviders[currentCategory || ""]) {
        setErrors({ extraServices: "Service provider is required" });
        return;
      }
      if (packages.length > 0) {
        setCurrentStep(2);
      } else {
        if (currentCategoryIndex < selectedCategories.length - 1) {
          setCurrentCategory(selectedCategories[currentCategoryIndex + 1]);
          setCurrentStep(1);
        } else {
          await handleDone();
        }
      }
    } else if (currentStep === 2) {
      if (!selectedPackages[currentCategory || ""]) {
        setErrors({ extraServices: "Package is required" });
        return;
      }
      if (currentCategoryIndex < selectedCategories.length - 1) {
        setCurrentCategory(selectedCategories[currentCategoryIndex + 1]);
        setCurrentStep(1);
      } else {
        await handleDone();
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
              setServiceProviders(data.servicesProviders);
              console.log("Service Providers:", data.servicesProviders);
            }
          })
          .catch((error) =>
            console.error("Error fetching service providers:", error)
          );
      }
    }
  }, [currentCategory, extraServices]);

  if (extraServices.length === 0) {
    return (
      <div className="flex flex-col gap-10 h-full justify-center items-center">
        <div className="text-primary font-bold text-xl md:text-3xl text-center">
          No Extra Services Available
        </div>
        <button
          onClick={onBack}
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
    <div className="h-full">
      <div className="flex flex-col gap-4 items-center h-full">
        <div className="text-primary font-bold text-xl md:text-3xl py-5">
          {translations.booking.chooseExtraServices}
        </div>

        {currentStep === 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 max-[370px]:grid-cols-1 gap-10 mt-10">
              {extraServices.map((service, index) => (
                <div key={index} className="">
                  <CategoryCard
                    imageSrc={service.image}
                    altText={service.serviceName}
                    category={service.serviceName}
                    isSelected={selectedCategories.includes(
                      service.serviceName
                    )}
                    onClick={() => handleCategorySelect(service.serviceName)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-5 mt-5 md:mt-10">
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
                onClick={handleNext}
                disabled={selectedCategories.length === 0}
                className="next-btn bg-primary hover:bg-[#faebdc] hover:text-primary"
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
          </span>{" "}
              </button>
            </div>
          </>
        )}

        {currentStep === 1 && currentCategory && (
          <div className="flex flex-col gap-5 justify-center items-center">
            <h2 className="text-center mt-2 text-primary font-bold text-lg">
              Select {currentCategory}
            </h2>
            <ul className="grid grid-cols-2 max-[500px]:gap-3 max-[500px]:grid-cols-1  md:grid-cols-3 gap-8">
              {serviceProviders.map((provider, index) => (
                <div
                  key={index}
                  className={`px-6 py-5 rounded-3xl shadow-lg cursor-pointer ${
                    selectedServiceProviders[currentCategory] === provider._id
                      ? "border-b-2 border-primary"
                      : ""
                  }`}
                  onClick={() =>
                    handleServiceProviderSelect(currentCategory, provider)
                  }
                >
                  <div className="relative h-36 w-36">
                    <Image
                      src={provider.profile}
                      alt="provider"
                      fill
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <div className="text-center mt-2 text-primary font-bold text-lg">
                    {provider.providerName}
                  </div>
                </div>
              ))}
            </ul>
            <div className="flex gap-5 my-5">
              <button
                onClick={handleBack}
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
          <span>{translations.booking.backBtn}</span>{" "}
              </button>
              <button
                className="next-btn bg-primary hover:bg-[#faebdc] hover:text-primary"
                onClick={handleNext}
                disabled={!selectedServiceProviders[currentCategory]}
              >
                 <span>{ translations.booking.nextBtn}</span>
          <span className="ml-3 ">
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
        )}

        {currentStep === 2 &&
          currentCategory &&
          selectedServiceProviders[currentCategory] && (
            <div className="flex flex-col gap-5 justify-center items-center">
              <h2 className="text-center mt-2 text-primary font-bold text-lg">
                Select Packages for {currentCategory}
              </h2>
              {selectedProvider && (
                <div className="flex flex-col md:flex-row gap-5 mx-2">
                  <div className="bg-white h-fit shadow-lg max-md:mx-auto shadow-gray-300 px-6 py-3 rounded-2xl">
                    <div className="h-28 w-28 relative">
                      <Image
                        src={selectedProvider.profile}
                        alt="provider"
                        fill
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                    <h3 className="text-center mt-2 text-primary font-bold text-lg">
                      {selectedProvider.providerName}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-5">
                    {packages.map((pkg, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 bg-white p-2 rounded-xl cursor-pointer ${
                          selectedPackages[currentCategory] === pkg.packageName
                            ? "border-b-2 border-primary"
                            : ""
                        }`}
                        onClick={() =>
                          handlePackageSelect(currentCategory, pkg.packageName)
                        }
                      >
                        <div className="relative h-32 w-36">
                          <Image
                            src={pkg.packageLogo}
                            alt={pkg.packageName}
                            fill
                            objectFit="cover"
                            className="rounded-2xl"
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
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-5 my-5">
                <button
                  onClick={handleBack}
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
          <span>{translations.booking.backBtn}</span>{" "}
                </button>
                <button
                  onClick={handleNext}
                  className="next-btn bg-primary hover:bg-[#faebdc] hover:text-primary"
                >
                  {currentCategoryIndex < selectedCategories.length - 1
                    ? translations.booking.nextCategory
                  : translations.booking.done}
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

const ExtraServicesPage: React.FC<ExtraServiceProps> = ({
  extraServices,
  onExtraServiceSelect,
  onBack,
}) => {
  const { data, error, isLoading } = useGetExtraServiceQuery<any>({
    
  });

  const handleExtraServiceSelect = (selectedData: SelectedData) => {
    console.log("Selected Data from Child:", selectedData);
    onExtraServiceSelect(selectedData);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  if (error) return <div>Error loading extra services</div>;

  return (
    <ParentComponent
      extraServices={data?.extraServices || []}
      onExtraServiceSelect={handleExtraServiceSelect}
      onBack={onBack} // Pass the onBack prop
    />
  );
};

export default ExtraServicesPage;