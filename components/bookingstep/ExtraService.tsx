// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { useGetExtraServiceQuery } from "@/store/endpoints/apiSlice";

// interface ServiceCardProps {
//   imageSrc: string;
//   altText: string;
//   serviceName: string;
//   isSelected: boolean;
//   onClick: () => void;
// }

// const ServiceCard: React.FC<ServiceCardProps> = ({
//   imageSrc,
//   altText,
//   serviceName,
//   isSelected,
//   onClick,
// }) => {
//   return (
//     <div
//       className={`bg-[#FDFDF9] rounded-3xl px-6 py-3 cursor-pointer ${
//         isSelected ? "shadow-lg border-b-2 border-primary" : ""
//       }`}
//       onClick={onClick}
//     >
//       <div className="relative rounded-full h-28 w-28 bg-[#c2937b]">
//         <Image src={imageSrc} layout="fill" objectFit="contain" alt={altText} />
//       </div>
//       <div className="text-primary text-center font-bold mt-2">
//         {serviceName}
//       </div>
//     </div>
//   );
// };

// interface ChooseExtraServiceProps {
//   onExtraServiceSelect: (data: {
//     selectedServices: string[];
//     djPackage?: string;
//     dancersPackage?: string;
//     organizerPackage?: string;
//   }) => void;
// }

// const ChooseExtraService: React.FC<ChooseExtraServiceProps> = ({
//   onExtraServiceSelect,
// }) => {
//   const [selectedServices, setSelectedServices] = useState<string[]>([]);
//   const [currentStep, setCurrentStep] = useState<
//     "services" | "dj" | "dancers" | "organizer"
//   >("services");
//   const [djPackage, setDjPackage] = useState<string | null>(null);
//   const [dancersPackage, setDancersPackage] = useState<string | null>(null);
//   const [organizerPackage, setOrganizerPackage] = useState<string | null>(null);

//   const {
//     data: extraServicesResponse,
//     isLoading,
//     isError,
//   } = useGetExtraServiceQuery();

//   const handleCardClick = (id: string) => {
//     if (selectedServices.includes(id)) {
//       setSelectedServices((prev) =>
//         prev.filter((serviceId) => serviceId !== id)
//       );
//     } else {
//       setSelectedServices((prev) => [...prev, id]);
//     }
//     setCurrentStep(id as "dj" | "dancers" | "organizer"); // Set the current step based on the selected service
//   };

//   const handleNextClick = () => {
//     console.log("Selected Services:", selectedServices);
//     console.log("Current Step:", currentStep);

//     if (selectedServices.length === 0) {
//       console.error("No services selected.");
//       return;
//     }

//     onExtraServiceSelect({
//       selectedServices,
//       djPackage: djPackage || undefined,
//       dancersPackage: dancersPackage || undefined,
//       organizerPackage: organizerPackage || undefined,
//     });
//   };

//   const handleBackClick = () => {
//     setCurrentStep("services"); // Go back to services
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError || !extraServicesResponse?.status) {
//     return <div>Error fetching extra services.</div>;
//   }

//   const services = extraServicesResponse.extraServices;

//   return (
//     <div className="">
//       <div className="text-primary text-center font-semibold text-3xl">
//         Choose Extra Services
//       </div>
//       <div className="flex flex-row justify-center gap-5 mt-5 md:mt-10">
//         {services.map((service) => (
//           <ServiceCard
//             key={service._id}
//             imageSrc={service.image}
//             altText={service.serviceName}
//             serviceName={service.serviceName}
//             isSelected={selectedServices.includes(service._id)}
//             onClick={() => handleCardClick(service._id)}
//           />
//         ))}
//       </div>

//       {currentStep === "dj" && (
//         <div className="mt-10">
//           <h2>Select DJ Package</h2>
//           <input
//             type="text"
//             placeholder="Select DJ Package"
//             value={djPackage || ""}
//             onChange={(e) => setDjPackage(e.target.value)}
//           />
//         </div>
//       )}

//       {currentStep === "dancers" && (
//         <div className="mt-10">
//           <h2>Select Dancers Package</h2>
//           <input
//             type="text"
//             placeholder="Select Dancers Package"
//             value={dancersPackage || ""}
//             onChange={(e) => setDancersPackage(e.target.value)}
//           />
//         </div>
//       )}

//       {currentStep === "organizer" && (
//         <div className="mt-10">
//           <h2>Select Organizer Package</h2>
//           <input
//             type="text"
//             placeholder="Select Organizer Package"
//             value={organizerPackage || ""}
//             onChange={(e) => setOrganizerPackage(e.target.value)}
//           />
//         </div>
//       )}

//       <div className="flex flex-row justify-center gap-5 mt-5 md:mt-10">
//         {currentStep !== "services" && (
//           <div
//             className="p-2 rounded-lg border border-primary text-primary cursor-pointer"
//             onClick={handleBackClick}
//           >
//             &lt; Back
//           </div>
//         )}
//         <div
//           className={`p-2 rounded-lg ${
//             selectedServices.length > 0
//               ? "bg-primary text-gray-100"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//           }`}
//           onClick={handleNextClick}
//         >
//           {currentStep === "organizer" ? "Done" : "Next &gt;"}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChooseExtraService;


import React, { useState } from 'react';

// Parent Component
const ParentComponent = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showFinalPackages, setShowFinalPackages] = useState(false);

  // Mock data for categories and their packages
  const categories = {
    DJ: ['DJ Package 1', 'DJ Package 2', 'DJ Package 3'],
    Dancers: ['Dancers Package 1', 'Dancers Package 2'],
    Organizer: ['Organizer Package 1', 'Organizer Package 2', 'Organizer Package 3'],
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
      // Remove packages for the deselected category
      const updatedPackages = { ...selectedPackages };
      delete updatedPackages[category];
      setSelectedPackages(updatedPackages);
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Handle package selection
  const handlePackageSelect = (category, packageOption) => {
    const updatedPackages = { ...selectedPackages };
    if (!updatedPackages[category]) {
      updatedPackages[category] = [];
    }
    if (updatedPackages[category].includes(packageOption)) {
      updatedPackages[category] = updatedPackages[category].filter((pkg) => pkg !== packageOption);
    } else {
      updatedPackages[category].push(packageOption);
    }
    setSelectedPackages(updatedPackages);
  };

  // Handle next button click
  const handleNext = () => {
    if (currentStep < selectedCategories.length) {
      setCurrentStep(currentStep + 1); // Move to the next category
    } else {
      setShowFinalPackages(true); // Show final selected packages
    }
  };

  // Handle back button click
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1); // Move to the previous category
    } else {
      setShowFinalPackages(false); // Go back to category selection
    }
  };

  return (
    <div>
      <h1>Select Categories</h1>

      {/* Render initial categories */}
      {!showFinalPackages && currentStep === 0 && (
        <div>
          {Object.keys(categories).map((category, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={category}
                name="category"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategorySelect(category)}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
          <button onClick={handleNext} disabled={selectedCategories.length === 0}>
            Next
          </button>
        </div>
      )}

      {/* Render packages for the selected categories step-by-step */}
      {!showFinalPackages && currentStep > 0 && (
        <div>
          <h2>Select Packages for {selectedCategories[currentStep - 1]}</h2>
          <ul>
            {categories[selectedCategories[currentStep - 1]].map((packageOption, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  id={packageOption}
                  name="package"
                  value={packageOption}
                  checked={
                    selectedPackages[selectedCategories[currentStep - 1]]?.includes(packageOption) || false
                  }
                  onChange={() => handlePackageSelect(selectedCategories[currentStep - 1], packageOption)}
                />
                <label htmlFor={packageOption}>{packageOption}</label>
              </li>
            ))}
          </ul>
          <button onClick={handleBack}>Back</button>
          {currentStep < selectedCategories.length ? (
            <button onClick={handleNext}>Next</button>
          ) : (
            <button onClick={() => setShowFinalPackages(true)}>Submit</button>
          )}
        </div>
      )}

      {/* Show final selected packages */}
      {showFinalPackages && (
        <div>
          <h2>Final Selected Packages:</h2>
          {selectedCategories.map((category) => (
            <div key={category}>
              <h3>{category} Packages:</h3>
              <ul>
                {selectedPackages[category]?.map((packageOption, index) => (
                  <li key={index}>{packageOption}</li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={() => setShowFinalPackages(false)}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default ParentComponent;