"use client";

import { useState } from "react";
import BookingPage from "@/components/bookingstep/BookingPage";
import EventType from "@/components/bookingstep/EventType";
import ChooseDesigns from "@/components/bookingstep/ChooseDesigns";
import ChoosePackage from "@/components/bookingstep/ChoosePackage";
import PackageDetails from "@/components/bookingstep/PackageDetails";
import ChooseAdditional from "@/components/bookingstep/ChooseAdditional";
import ExtraService from "@/components/bookingstep/ExtraService";

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
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [bookingData, setBookingData] = useState<FormData | null>(null);
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
  const [extraServices, setExtraServices] = useState<ExtraServiceData[]>([]);

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
    setEventPackageAdditions(data.eventPackageAdditions);
    console.log("Event Package Additions:", data.eventPackageAdditions);
    setCurrentStep(7); // Move to the "Extra Service" step
  };

  const handleNext = () => {
    if (currentStep === 2 && selectedEventTypeId) {
      setCurrentStep(3);
    } else if (currentStep === 3 && selectedDesignId) {
      setCurrentStep(4);
    } else if (currentStep === 4 && selectedPackageId) {
      setCurrentStep(5);
    } else {
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
            bookingData={bookingData}
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
            place={bookingData.place}
            eventDesign={selectedDesignId}
            eventType={selectedEventTypeId}
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
            packageId={selectedPackageId}
            onBack={handleBack}
            onSubmit={handleAdditionalDataSubmit}
          />
        )}
        {currentStep === 7 && (
          <ExtraService
            eventPackageAdditions={eventPackageAdditions}
            extraServices={extraServices}
            onBack={handleBack}
          />
        )}
      </section>
    </main>
  );
};

export default RootPage;
