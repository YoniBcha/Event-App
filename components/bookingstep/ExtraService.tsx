import React, { useState } from "react";

const ParentComponent = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedServiceProviders, setSelectedServiceProviders] = useState({});
  const [selectedPackages, setSelectedPackages] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showFinalPackages, setShowFinalPackages] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const categories = {
    DJ: {
      "DJ 1": ["DJ 1 Package 1", "DJ 1 Package 2"],
      "DJ 2": ["DJ 2 Package 1", "DJ 2 Package 2"],
      "DJ 3": ["DJ 3 Package 1", "DJ 3 Package 2"],
    },
    Dancers: {
      "Dancer Group 1": ["Dancer Group 1 Package 1", "Dancer Group 1 Package 2"],
      "Dancer Group 2": ["Dancer Group 2 Package 1", "Dancer Group 2 Package 2"],
    },
    Organizer: {
      "Organizer 1": ["Organizer 1 Package 1", "Organizer 1 Package 2"],
      "Organizer 2": ["Organizer 2 Package 1", "Organizer 2 Package 2"],
      "Organizer 3": ["Organizer 3 Package 1", "Organizer 3 Package 2"],
    },
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
      // Remove service providers and packages for the deselected category
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

  // Handle service provider selection (e.g., DJ 1, DJ 2)
  const handleServiceProviderSelect = (category, provider) => {
    const updatedServiceProviders = { ...selectedServiceProviders };
    if (!updatedServiceProviders[category]) {
      updatedServiceProviders[category] = [];
    }
    if (updatedServiceProviders[category].includes(provider)) {
      updatedServiceProviders[category] = updatedServiceProviders[
        category
      ].filter((p) => p !== provider);
      // Remove packages for the deselected provider
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

  // Handle package selection
  const handlePackageSelect = (category, provider, packageOption) => {
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
      // Move from category selection to service provider selection
      setCurrentCategory(selectedCategories[currentStep]);
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Move from service provider selection to package selection
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Move to the next category or show final packages
      if (currentCategoryIndex < selectedCategories.length - 1) {
        setCurrentCategory(selectedCategories[currentCategoryIndex + 1]);
        setCurrentStep(1); // Go to service provider selection for the next category
      } else {
        setShowFinalPackages(true); // Show final selected packages
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

  const currentCategoryIndex = selectedCategories.indexOf(currentCategory);

  return (
    <div>
      <h1>Select Categories</h1>

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
          <button
            onClick={handleNext}
            disabled={selectedCategories.length === 0}
          >
            Next
          </button>
        </div>
      )}

      {/* Render service providers for the selected category */}
      {!showFinalPackages &&
        currentStep === 1 &&
        currentCategory && (
          <div>
            <h2>Select {currentCategory}</h2>
            <ul>
              {Object.keys(categories[currentCategory]).map((provider, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    id={provider}
                    name="provider"
                    value={provider}
                    checked={
                      selectedServiceProviders[currentCategory]?.includes(
                        provider
                      ) || false
                    }
                    onChange={() =>
                      handleServiceProviderSelect(currentCategory, provider)
                    }
                  />
                  <label htmlFor={provider}>{provider}</label>
                </li>
              ))}
            </ul>
            <button onClick={handleBack}>Back</button>
            <button
              onClick={handleNext}
              disabled={
                !selectedServiceProviders[currentCategory]?.length
              }
            >
              Next
            </button>
          </div>
        )}

      {/* Render packages for the selected service providers */}
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

      {/* Show final selected packages */}
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

export default ParentComponent;