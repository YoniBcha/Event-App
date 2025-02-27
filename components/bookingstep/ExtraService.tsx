import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useGetExtraServiceQuery } from "@/store/endpoints/apiSlice";
import { motion } from "framer-motion";
import * as Yup from "yup";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ExtraServiceProps {
  extraServices: any;
  onExtraServiceSelect: (selectedService: any) => void;
  onBack: () => void;
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
      className={`bg-[#FDFDF9] hover:bg-secondary rounded-3xl px-6 py-3 cursor-pointer ${
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
  onBack: () => void;
}

const validationSchema = Yup.object().shape({
  extraServices: Yup.array()
    .of(
      Yup.object().shape({
        servicesProvider_id: Yup.string().required("Service provider is required"),
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
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const translations = useSelector((state: any) => state.language.translations);
  const currentLocale = useSelector((state: any) => state.language.currentLocale);

  // Filter categories with providerCount > 0
  const filteredCategories = extraServices.filter(service => service.providerCount > 0);

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
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

  const handleServiceProviderSelect = (category: string, provider: ServiceProvider) => {
    const updatedServiceProviders = { ...selectedServiceProviders };
    if (updatedServiceProviders[category] === provider._id) {
      delete updatedServiceProviders[category];
      setSelectedProvider(null);
      setPackages([]);
    } else {
      updatedServiceProviders[category] = provider._id;
      setSelectedProvider(provider);
      fetchPackages(provider._id);
    }
    setSelectedServiceProviders(updatedServiceProviders);
  };

  const handleDone = async () => {
    const selectedData: SelectedData = {
      extraServices: selectedCategories.map((category) => ({
        servicesProvider_id: selectedServiceProviders[category] || "",
        packageName: selectedPackages[category] || "",
      })),
    };

    if (selectedCategories.length === 0) {
      onExtraServiceSelect({ extraServices: [] });
      return;
    }

    const isValid = await validateData();
    if (!isValid) return;

    console.log("Selected Data:", selectedData);
    onExtraServiceSelect(selectedData);
  };

  const fetchPackages = (providerId: string) => {
    fetch(`https://eventapp-back-cr86.onrender.com/api/v1/event/getSingleServiceProvider/${providerId}`)
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
        await handleDone();
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

  const currentCategoryIndex = selectedCategories.indexOf(currentCategory || "");

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
          .catch((error) => console.error("Error fetching service providers:", error));
      }
    }
  }, [currentCategory, extraServices]);

  if (filteredCategories.length === 0) {
    return (
      <motion.div
        className="flex flex-col gap-10 h-full justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-primary font-bold text-xl md:text-3xl text-center">
          {translations.booking.noServiceAvaliable}
        </div>

        <motion.button
          onClick={onBack}
          className="back-btn flex items-center hover:bg-secondary p-2 rounded-lg border border-primary text-primary cursor-pointer"
          variants={{
            hover: {
              scale: 1.05,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              transition: { duration: 0.2, ease: "easeInOut" },
            },
            tap: {
              scale: 0.95,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              transition: { duration: 0.1, ease: "easeInOut" },
            },
          }}
          whileHover="hover"
          whileTap="tap"
        >
          <span className="mr-2">
            {currentLocale === "ar" ? <FaChevronRight /> : <FaChevronLeft />}
          </span>
          <span>{translations.booking.backBtn}</span>
        </motion.button>
      </motion.div>
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
              {filteredCategories.map((service, index) => (
                <motion.div
                  key={index}
                  className="rounded-3xl b"
                  variants={{
                    hover: {
                      scale: 1.05,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                      transition: { duration: 0.2, ease: "easeInOut" },
                    },
                    tap: {
                      scale: 0.95,
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                      transition: { duration: 0.1, ease: "easeInOut" },
                    },
                  }}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <CategoryCard
                    imageSrc={service.image}
                    altText={service.serviceName}
                    category={service.serviceName}
                    isSelected={selectedCategories.includes(service.serviceName)}
                    onClick={() => handleCategorySelect(service.serviceName)}
                  />
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-5 mt-5 md:mt-10">
              <motion.button
                onClick={onBack}
                className="back-btn hover:bg-secondary"
                variants={{
                  hover: {
                    scale: 1.05,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.2, ease: "easeInOut" },
                  },
                  tap: {
                    scale: 0.95,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.1, ease: "easeInOut" },
                  },
                }}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="mr-2">
                  {currentLocale === "ar" ? <FaChevronRight /> : <FaChevronLeft />}
                </span>
                <span>{translations.booking.backBtn}</span>
              </motion.button>
              <motion.button
                onClick={handleNext}
                className="next-btn bg-primary hover:bg-secondary hover:text-primary"
                variants={{
                  hover: {
                    scale: 1.05,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.2, ease: "easeInOut" },
                  },
                  tap: {
                    scale: 0.95,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.1, ease: "easeInOut" },
                  },
                }}
                whileHover="hover"
                whileTap="tap"
              >
                <span>{translations.booking.nextBtn}</span>
                <span className="ml-3">
                  {currentLocale === "ar" ? <FaChevronLeft /> : <FaChevronRight />}
                </span>
              </motion.button>
            </div>
          </>
        )}

        {currentStep === 1 && currentCategory && (
          <div className="flex flex-col gap-5 justify-center items-center">
            <h2 className="text-center mt-2 text-primary font-bold text-lg">
              {translations.booking.select} {currentCategory}
            </h2>
            <ul className="grid grid-cols-2 max-[500px]:gap-3 max-[500px]:grid-cols-1  md:grid-cols-3 gap-8">
              {serviceProviders.map((provider, index) => (
                <motion.div
                  key={index}
                  className={`px-6 py-5 hover:bg-secondary rounded-3xl  shadow-lg cursor-pointer ${
                    selectedServiceProviders[currentCategory] === provider._id
                      ? "border-b-2 border-primary !border-b-primary" // Ensure border is applied
                      : ""
                  }`}
                  onClick={() =>
                    handleServiceProviderSelect(currentCategory, provider)
                  }
                  variants={{
                    hover: {
                      scale: 1.05,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                      transition: { duration: 0.2, ease: "easeInOut" },
                    },
                    tap: {
                      scale: 0.95,
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                      transition: { duration: 0.1, ease: "easeInOut" },
                    },
                  }}
                  whileHover="hover"
                  whileTap="tap"
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
                </motion.div>
              ))}
            </ul>
            <div className="flex gap-5 my-5">
              <motion.button
                onClick={handleBack}
                className="back-btn hover:bg-secondary"
                variants={{
                  hover: {
                    scale: 1.05,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",

                    transition: { duration: 0.2, ease: "easeInOut" },
                  },
                  tap: {
                    scale: 0.95,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.1, ease: "easeInOut" },
                  },
                }}
                whileHover="hover"
                whileTap="tap"
              >
                <span className="mr-2">
                  {currentLocale === "ar" ? (
                    <FaChevronRight /> // Right arrow for Arabic
                  ) : (
                    <FaChevronLeft /> // Left arrow for English
                  )}
                </span>
                <span>{translations.booking.backBtn}</span>{" "}
              </motion.button>
              <motion.button
                className="next-btn bg-primary hover:bg-secondary "
                onClick={handleNext}
                // disabled={!selectedServiceProviders[currentCategory]}
                variants={{
                  hover: {
                    scale: 1.05,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.2, ease: "easeInOut" },
                  },
                  tap: {
                    scale: 0.95,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    transition: { duration: 0.1, ease: "easeInOut" },
                  },
                }}
                whileHover="hover"
                whileTap="tap"
              >
                <span>{translations.booking.nextBtn}</span>
                <span className="ml-3">
                  {currentLocale === "ar" ? (
                    <FaChevronLeft /> // Left arrow for Arabic
                  ) : (
                    <FaChevronRight /> // Right arrow for English
                  )}
                </span>
              </motion.button>
            </div>
          </div>
        )}

        {currentStep === 2 &&
          currentCategory &&
          selectedServiceProviders[currentCategory] && (
            <div className="flex flex-col gap-5 justify-center items-center">
              <h2 className="text-center mt-2 text-primary font-bold text-lg">
               {translations.booking.selectPackage} {currentCategory}
              </h2>
              {selectedProvider && (
                <div className="flex flex-col md:flex-row gap-5 mx-2">
                  <div className="bg-white hover:bg-secondary h-fit shadow-lg max-md:mx-auto shadow-gray-300 px-6 py-3 rounded-2xl">
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
                      <motion.div
                        key={index}
                        className={`flex max-sm:flex-col hover:bg-secondary items-center gap-2 bg-white p-2 rounded-xl cursor-pointer ${
                          selectedPackages[currentCategory] === pkg.packageName
                            ? "border-b-2 border-primary !border-b-primary"
                            : ""
                        }`}
                        onClick={() =>
                          handlePackageSelect(currentCategory, pkg.packageName)
                        }
                        variants={{
                          hover: {
                            scale: 1.05,
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                            transition: { duration: 0.2, ease: "easeInOut" },
                          },
                          tap: {
                            scale: 0.95,
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                            transition: { duration: 0.1, ease: "easeInOut" },
                          },
                        }}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        {/* Image Container */}
                        <div className="relative h-20 w-24 sm:h-24 sm:w-28 lg:h-32 lg:w-36 flex-shrink-0">
                          {" "}
                          {/* Responsive width and height */}
                          <Image
                            src={pkg.packageLogo}
                            alt={pkg.packageName}
                            width={1000} // Default width for larger screens
                            height={1000} // Default height for larger screens
                            className="rounded-2xl object-scale-down" // Ensure the image covers the area
                          />
                        </div>
                        {/* Text Content */}
                        <div>
                          <p className="text-primary font-bold text-lg">
                            {pkg.packageName}
                          </p>
                          <p className="text-primary text-sm">
                            {pkg.packageDescription}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-5 my-5">
                {/* Back Button */}
                <motion.button
                  onClick={handleBack}
                  className="back-btn flex items-center hover:bg-secondary p-2 bg-secondary rounded-lg border border-primary text-primary cursor-pointer"
                  variants={{
                    hover: {
                      scale: 1.05,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                      transition: { duration: 0.2, ease: "easeInOut" },
                    },
                    tap: {
                      scale: 0.95,
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                      transition: { duration: 0.1, ease: "easeInOut" },
                    },
                  }}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span className="mr-2">
                    {currentLocale === "ar" ? (
                      <FaChevronRight /> // Right arrow for Arabic
                    ) : (
                      <FaChevronLeft /> // Left arrow for English
                    )}
                  </span>
                  <span>{translations.booking.backBtn}</span>
                </motion.button>

                {/* Next Button */}
                <motion.button
                  onClick={handleNext}
                  className="next-btn flex items-center p-2 rounded-lg text-white bg-primary hover:bg-secondary hover:text-primary cursor-pointer"
                  variants={{
                    hover: {
                      scale: 1.05,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",

                      transition: { duration: 0.2, ease: "easeInOut" },
                    },
                    tap: {
                      scale: 0.95,
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                      transition: { duration: 0.1, ease: "easeInOut" },
                    },
                  }}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {currentCategoryIndex < selectedCategories.length - 1
                    ? translations.booking.nextCategory
                    : translations.booking.done}
                </motion.button>
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
  const { data, error, isLoading } = useGetExtraServiceQuery<any>({});

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
