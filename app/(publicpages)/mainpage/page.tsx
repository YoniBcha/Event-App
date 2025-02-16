"use client";

import { useState } from "react";
import BookingPage from "@/components/bookingstep/BookingPage";
import EventType from "@/components/bookingstep/EventType";
import ChooseDesigns from "@/components/bookingstep/ChooseDesigns";
import ChoosePackage from "@/components/bookingstep/ChoosePackage";
import PackageDetails from "@/components/bookingstep/PackageDetails";
import ChooseAdditional from "@/components/bookingstep/ChooseAdditional";
import ExtraService from "@/components/bookingstep/ExtraService";
import LastReservation from "@/components/bookingstep/LastReservation";

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
  servicesProvider_id: string;
  packageName: string;
}

const RootPage = () => {
  const [extraServices, setExtraServices] = useState<ExtraServiceData[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
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

  const handleBookingData = (data: FormData) => {
    setBookingData(data);
    console.log("Booking Data:", data);
    setCurrentStep(2);
  };

  const handleEventTypeSelect = (eventTypeId: string) => {
    setSelectedEventTypeId(eventTypeId);
    console.log("Selected Event Type ID:", eventTypeId);
  };

  const handleDesignSelect = (designId: string | null) => {
    setSelectedDesignId(designId);
    console.log("Selected Design ID:", designId);
    if (designId) {
      handleNext();
    }
  };

  const handlePackageSelect = (packageId: string | null) => {
    setSelectedPackageId(packageId);
    console.log("Selected Package ID:", packageId);
    if (packageId) {
      handleNext();
    }
  };

  const handlePackageDetailsNext = (packageId: string) => {
    console.log("Package ID from PackageDetails:", packageId);
    setCurrentStep(6); // Move to the "Choose Additional" step
  };

  const handleAdditionalDataSubmit = (data: {
    eventPackageAdditions: EventPackageAddition[];
  }) => {
    console.log("Event Package Additions:", data.eventPackageAdditions);
    setCurrentStep(7);
  };

  const handleExtraServiceSelect = (selectedService: ExtraServiceData) => {
    setExtraServices((prev) => [...prev, selectedService]);
    console.log("Updated Extra Services:", [...extraServices, selectedService]);
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

  return (
    <main className="h-full w-full">
      <section className="h-full w-full">
        {currentStep === 1 && (
          <BookingPage setBookingPageData={handleBookingData} />
        )}
        {currentStep === 2 && (
          <EventType
            onEventTypeSelect={handleEventTypeSelect}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && selectedEventTypeId && (
          <ChooseDesigns
            id={selectedEventTypeId}
            onNext={handleDesignSelect}
            onBackClick={handleBack}
          />
        )}
        {currentStep === 4 && selectedDesignId && bookingData && (
          <ChoosePackage
            place={bookingData?.place ?? ""}
            eventDesign={selectedDesignId ?? ""}
            eventType={selectedEventTypeId ?? ""}
            onNext={handlePackageSelect}
            onBackClick={handleBack}
          />
        )}
        {currentStep === 5 && selectedPackageId && (
          <PackageDetails
            packageId={selectedPackageId}
            onNextClick={handlePackageDetailsNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 6 && selectedPackageId && (
          <ChooseAdditional
            packageId={selectedPackageId ?? ""}
            onBack={handleBack}
            onSubmit={handleAdditionalDataSubmit}
          />
        )}
        {currentStep === 7 && (
          <ExtraService
            extraServices={extraServices}
            onExtraServiceSelect={handleExtraServiceSelect}
          />
        )}
        {currentStep === 8 && <LastReservation />}
      </section>
    </main>
  );
};

export default RootPage;
