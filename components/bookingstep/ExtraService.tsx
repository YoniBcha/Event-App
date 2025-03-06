/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useGetExtraServiceQuery } from "@/store/endpoints/apiSlice";
import { motion } from "framer-motion";

interface ExtraServiceProps {
  onExtraServiceSelect: (selectedService: any) => void;
  onBack: () => void;
}

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
  packagePrice: number;
}

interface SelectedData {
  extraServices: {
    servicesProvider_id: string;
    packageName: string;
  }[];
}

const ParentComponent: React.FC<ExtraServiceProps> = ({
  onExtraServiceSelect,
  onBack,
}) => {
  const [selectedServices, setSelectedServices] = useState<
    { serviceName: string; providerId: string; packageName: string }[]
  >([]);
  const [currentService, setCurrentService] = useState<string | null>(null);
  const [currentProvider, setCurrentProvider] = useState<string | null>(null);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(
    []
  );
  const [packages, setPackages] = useState<Package[]>([]);
  const translations = useSelector((state: any) => state.language.translations);
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );

  const { data, isLoading, error } = useGetExtraServiceQuery<any>({});

  // Load saved data from sessionStorage on component mount
  useEffect(() => {
    const savedServices = JSON.parse(
      sessionStorage.getItem("selectedServices") || "[]"
    );
    if (savedServices.length > 0) {
      setSelectedServices(savedServices);

      // Prefill the current service and provider if available
      const lastSelectedService = savedServices[savedServices.length - 1];
      if (lastSelectedService) {
        setCurrentService(lastSelectedService.serviceName);
        setCurrentProvider(lastSelectedService.providerId);
      }
    }
  }, []);

  useEffect(() => {
    if (currentProvider && window.innerWidth <= 500) {
      const selectedProviderIndex = serviceProviders.findIndex(
        (provider) => provider._id === currentProvider
      );
      if (selectedProviderIndex !== -1) {
        const reorderedProviders = [
          ...serviceProviders.slice(0, selectedProviderIndex),
          ...serviceProviders.slice(selectedProviderIndex + 1),
          serviceProviders[selectedProviderIndex],
        ];
        setServiceProviders(reorderedProviders);
      }
    }
  }, [currentProvider]);

  // Save selected services to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(
      "selectedServices",
      JSON.stringify(selectedServices)
    );
  }, [selectedServices]);

  // Fetch service providers when a service is selected
  useEffect(() => {
    if (currentService) {
      const service = data?.extraServices.find(
        (s: any) => s.serviceName === currentService
      );
      if (service) {
        fetch(
          `https://eventapp-back-cr86.onrender.com/api/v1/event/getExtraServiceProviders/${service._id}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.status) {
              setServiceProviders(data.servicesProviders);
            }
          })
          .catch((error) =>
            console.error("Error fetching service providers:", error)
          );
      }
    }
  }, [currentService, data]);

  // Fetch packages when a service provider is selected
  useEffect(() => {
    if (currentProvider) {
      fetch(
        `https://eventapp-back-cr86.onrender.com/api/v1/event/getSingleServiceProvider/${currentProvider}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status) {
            setPackages(data.data.packageList || []);
          }
        })
        .catch((error) => console.error("Error fetching packages:", error));
    }
  }, [currentProvider]);

  const handleServiceClick = (serviceName: string) => {
    if (currentService === serviceName) {
      // Unselect the service if it's already selected
      setCurrentService(null);
      setCurrentProvider(null);
    } else {
      setCurrentService(serviceName);
      setCurrentProvider(null);
    }
  };

  const handleProviderClick = (providerId: string) => {
    if (currentProvider === providerId) {
      // Unselect the provider if it's already selected
      setCurrentProvider(null);
    } else {
      setCurrentProvider(providerId);
    }
  };

  const handlePackageSelect = (packageName: string) => {
    const updatedServices = [...selectedServices];
    const existingServiceIndex = updatedServices.findIndex(
      (s) => s.serviceName === currentService
    );

    if (existingServiceIndex !== -1) {
      // If the service already exists, update its package
      if (updatedServices[existingServiceIndex].packageName === packageName) {
        // Unselect the package if it's already selected
        updatedServices.splice(existingServiceIndex, 1);
      } else {
        updatedServices[existingServiceIndex] = {
          serviceName: currentService!,
          providerId: currentProvider!,
          packageName,
        };
      }
    } else {
      // Add a new service with the selected package
      updatedServices.push({
        serviceName: currentService!,
        providerId: currentProvider!,
        packageName,
      });
    }

    setSelectedServices(updatedServices);
    setCurrentService(null);
    setCurrentProvider(null);
  };

  const handleUnselectService = (serviceName: string) => {
    const updatedServices = selectedServices.filter(
      (s) => s.serviceName !== serviceName
    );
    setSelectedServices(updatedServices);
  };

  const handleDone = (skip = false) => {
    const selectedData = skip
      ? { extraServices: [] } // Pass the correct structure when skipping
      : {
          extraServices: selectedServices.map((service) => ({
            servicesProvider_id: service.providerId,
            packageName: service.packageName,
          })),
        };
    onExtraServiceSelect(selectedData); // Pass the entire object
  };

  // Filter services that have providers
  const servicesWithProviders = data?.extraServices.filter((service: any) => {
    return service.providerCount > 0;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading extra services</div>;
  }

  return (
    <div className="h-full">
      <div className="flex flex-col gap-4 items-center h-full">
        <div className="text-primary font-bold text-xl md:text-3xl py-5">
          {translations.booking.chooseExtraServices}
        </div>

        {/* List of Services */}
        <div className="grid grid-cols-2 md:grid-cols-3 max-[370px]:grid-cols-1 gap-10 mt-10">
          {servicesWithProviders?.map((service: any, index: number) => {
            const isServiceSelected = selectedServices.some(
              (s) => s.serviceName === service.serviceName
            );
            return (
              <motion.div
                key={index}
                className="rounded-3xl relative"
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
                <div
                  className={`bg-[#FDFDF9] hover:bg-secondary rounded-3xl px-6 py-3 cursor-pointer ${
                    isServiceSelected
                      ? "shadow-lg border-b-2 border-primary bg-secondary"
                      : ""
                  }`}
                  onClick={() => {
                    handleServiceClick(service.serviceName);
                    handleUnselectService(service.serviceName);
                  }}
                >
                  <div className="relative rounded-full h-28 w-28 bg-[#c2937b]">
                    <Image
                      src={service.image}
                      layout="fill"
                      objectFit="contain"
                      alt={service.serviceName}
                    />
                  </div>
                  <div className="text-primary text-center font-bold mt-2">
                    {service.serviceName}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Service Providers */}
        {currentService && (
          <div className="flex flex-col gap-5 justify-center items-center">
            <h2 className="text-center mt-2 text-primary font-bold text-lg">
              {translations.booking.select} {currentService}
            </h2>
            <ul className="grid grid-cols-2 max-[500px]:gap-3 max-[500px]:grid-cols-1 md:grid-cols-3 gap-8">
              {serviceProviders.map((provider, index) => {
                const isProviderSelected = selectedServices.some(
                  (s) =>
                    s.serviceName === currentService &&
                    s.providerId === provider._id
                );
                return (
                  <motion.div
                    key={index}
                    className={`px-6 py-5 hover:bg-secondary rounded-3xl shadow-lg cursor-pointer ${
                      isProviderSelected
                        ? "border-b-2 border-primary bg-secondary"
                        : ""
                    }`}
                    onClick={() => handleProviderClick(provider._id)}
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
                );
              })}
            </ul>
          </div>
        )}

        {/* Packages */}
        {currentProvider && (
          <div className="flex flex-col gap-5 justify-center items-center">
            <h2 className="text-center mt-2 text-primary font-bold text-lg">
              {translations.booking.selectPackage} {currentService}{" "}
              {
                serviceProviders.find((p) => p._id === currentProvider)
                  ?.providerName
              }
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-5">
              {packages.map((pkg, index) => {
                const isPackageSelected = selectedServices.some(
                  (s) =>
                    s.serviceName === currentService &&
                    s.packageName === pkg.packageName
                );
                return (
                  <motion.div
                    key={index}
                    className={`flex max-lg:flex-col hover:bg-secondary items-center gap-2  p-2 rounded-xl cursor-pointer ${
                      isPackageSelected
                        ? "border-b-2 border-primary bg-secondary"
                        : "bg-white"
                    }`}
                    onClick={() => handlePackageSelect(pkg.packageName)}
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
                    <div className="relative h-20 w-24 sm:h-24 sm:w-28 lg:h-32 lg:w-36 flex-shrink-0 overflow-hidden">
                      <Image
                        src={pkg.packageLogo}
                        alt={pkg.packageName}
                        width={1000}
                        height={1000}
                        className="rounded-2xl object-contain w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-primary font-bold text-lg">
                        {pkg.packageName}
                      </p>
                      <p className="text-primary text-sm">
                        {pkg.packageDescription}
                      </p>
                      <p className="text-primary font-bold text-lg">
                        <span className="flex font-extrabold items-center gap-1">
                          {pkg.packagePrice}{" "}
                          <Image
                            src="/images/SR.png"
                            alt="SR"
                            width={15}
                            height={15}
                            className={`${
                              currentLocale === "ar" ? "scale-x-[-1]" : ""
                            }`}
                          />
                        </span>
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Buttons */}

        <div className="flex justify-center items-center gap-5 mt-5 md:mt-10">
          {selectedServices.length < 1 && (
            <motion.button
              onClick={() => handleDone(true)} // Call handleDone with skip=true
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
              <span>Skip</span>
            </motion.button>
          )}
          {selectedServices.length > 0 && (
            <motion.button
              onClick={() => handleDone(false)} // Call handleDone with skip=false
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
              <span>{translations.booking.done}</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentComponent;
