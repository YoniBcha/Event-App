/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import BookingPage from "@/components/bookingstep/BookingPage";
import EventType from "@/components/bookingstep/EventType";
import ChooseDesigns from "@/components/bookingstep/ChooseDesigns";
import ChoosePackage from "@/components/bookingstep/ChoosePackage";
import PackageDetails from "@/components/bookingstep/PackageDetails";
import ChooseAdditional from "@/components/bookingstep/ChooseAdditional";
import ExtraService from "@/components/bookingstep/ExtraService";
import PersonalDataComonents from "@/components/bookingstep/PersonalData";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion
interface FormData {
  city: string;
  place: string;
  date: Date | null;
}

interface EventPackageAddition {
  additionId: string;
  additionTypeName: string;
  quantity: number;
}

interface ExtraServiceData {
  extraServices: any;
  servicesProvider_id: string;
  packageName: string;
}

interface PersonalData {
  fullName: string;
  mobileNumber: string;
  secondMobileNumber?: string;
  favoriteColors: string;
  notes?: string;
}

const RootPage = () => {
  const router = useRouter();
  const [extraServices, setExtraServices] = useState<ExtraServiceData[]>([]);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const [bookingData, setBookingData] = useState<FormData>({
    city: "",
    place: "",
    date: null,
  });
  const [selectedEventTypeId, setSelectedEventTypeId] = useState<string | null>(
    null
  );
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );
  const [eventPackageAdditions, setEventPackageAdditions] = useState<
    EventPackageAddition[]
  >([]);

  // Retrieve the authenticated user from the store
  const authenticateUser = useSelector((state: any) => state.auth.user);

  const handleBookingData = (data: FormData) => {
    setBookingData(data);
    setCurrentStep(2);
  };

  const handleEventTypeSelect = (eventTypeId: string) => {
    setSelectedEventTypeId(eventTypeId);
  };

  const handleDesignSelect = (designId: string | null) => {
    setSelectedDesignId(designId);
    if (designId) {
      handleNext();
    }
  };

  const handlePackageSelect = (packageId: string | null) => {
    setSelectedPackageId(packageId);
    if (packageId) {
      handleNext();
    }
  };

  const handlePackageDetailsNext = () => {
    setCurrentStep(6);
  };

  const handleAdditionalDataSubmit = (data: {
    eventPackageAdditions: EventPackageAddition[];
  }) => {
    setEventPackageAdditions(data.eventPackageAdditions);
    setCurrentStep(7);
  };

  const handleExtraServiceSelect = (selectedService: ExtraServiceData) => {
    setExtraServices((prev) => {
      const updatedServices = [...prev, selectedService];
      setCurrentStep(8);
      return updatedServices;
    });
  };

  const handlePersonalDataSubmit = async (data: PersonalData) => {
    try {
      setPersonalData(data);

      const payload = {
        place: bookingData.place,
        date: bookingData.date?.toISOString(),
        city: bookingData.city,
        eventType: selectedEventTypeId,
        eventDesign: selectedDesignId,
        eventPackage: selectedPackageId,
        eventPackageAdditions: eventPackageAdditions,
        extraServices: extraServices.flatMap(
          (service) => service.extraServices
        ),
        personalData: data,
      };

      if (!authenticateUser) {
        router.push(
          `/login?payload=${encodeURIComponent(JSON.stringify(payload))}`
        );
      } else {
        await router.push(
          `/sidebar/booking?payload=${encodeURIComponent(
            JSON.stringify(payload)
          )}`
        );
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleNext = () => {
    switch (currentStep) {
      case 2:
        if (selectedEventTypeId) {
          setCurrentStep(3);
        }
        break;
      case 3:
        if (selectedDesignId) {
          setCurrentStep(4);
        }
        break;
      case 4:
        if (selectedPackageId) {
          setCurrentStep(5);
        }
        break;
      default:
        console.error("No selection made.");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const stepVariants = {
    hidden: { opacity: 0, x: currentLocale === "en" ? 100 : -100 }, // Slide in from the right for English, left for Arabic
    visible: { opacity: 1, x: 0 }, // Center of the screen
    exit: { opacity: 0, x: currentLocale === "en" ? -100 : 100 }, // Slide out to the left for English, right for Arabic
  };

  return (
    <main className="w-full">
      <section className="h-full w-full">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <BookingPage setBookingPageData={handleBookingData} />
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <EventType
                onEventTypeSelect={handleEventTypeSelect}
                onNext={handleNext}
                onBack={handleBack}
              />
            </motion.div>
          )}
          {currentStep === 3 && selectedEventTypeId && (
            <motion.div
              key="step-3"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <ChooseDesigns
                id={selectedEventTypeId}
                onNext={handleDesignSelect}
                onBackClick={handleBack}
              />
            </motion.div>
          )}
          {currentStep === 4 && selectedDesignId && bookingData && (
            <motion.div
              key="step-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <ChoosePackage
                place={bookingData?.place ?? ""}
                eventDesign={selectedDesignId ?? ""}
                eventType={selectedEventTypeId ?? ""}
                onNext={handlePackageSelect}
                onBackClick={handleBack}
              />
            </motion.div>
          )}
          {currentStep === 5 && selectedPackageId && (
            <motion.div
              key="step-5"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <PackageDetails
                packageId={selectedPackageId}
                onNextClick={handlePackageDetailsNext}
                onBack={handleBack}
              />
            </motion.div>
          )}
          {currentStep === 6 && selectedPackageId && (
            <motion.div
              key="step-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <ChooseAdditional
                packageId={selectedPackageId ?? ""}
                onBack={handleBack}
                onSubmit={handleAdditionalDataSubmit}
              />
            </motion.div>
          )}
          {currentStep === 7 && (
            <motion.div
              key="step-7"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <ExtraService
                // extraServices={extraServices}
                onExtraServiceSelect={handleExtraServiceSelect}
                onBack={handleBack}
              />
            </motion.div>
          )}
          {currentStep === 8 && (
            <motion.div
              key="step-8"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <PersonalDataComonents onSubmit={handlePersonalDataSubmit} />
            </motion.div>
          )}
          {currentStep === 9 && personalData && (
            <motion.div
              key="step-9"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h2>Personal Data Submitted:</h2>
                <pre>{JSON.stringify(personalData, null, 2)}</pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
};

export default RootPage;
