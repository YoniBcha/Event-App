"use client";

import { useState } from "react";
import BookingPage from "@/components/bookingstep/BookingPage";
import EventType from "@/components/bookingstep/EventType";
import ChooseDesigns from "@/components/bookingstep/ChooseDesigns";
import ChoosePackage from "@/components/bookingstep/ChoosePackage";

interface FormData {
  city: string;
  place: string;
  date: Date | null;
}

const RootPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [bookingData, setBookingData] = useState<FormData | null>(null);
  const [selectedEventTypeId, setSelectedEventTypeId] = useState<string | null>(
    null
  );
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);

  const handleBookingData = (data: FormData) => {
    setBookingData(data);
    console.log("Booking Data:", data);
    setCurrentStep(2); // Move to the next step (EventType)
  };

  const handleEventTypeSelect = (eventTypeId: string) => {
    setSelectedEventTypeId(eventTypeId);
    console.log("Selected Event Type ID:", eventTypeId);
  };

  const handleDesignSelect = (designId: string | null) => {
    setSelectedDesignId(designId);
    console.log("Selected Design ID:", designId);
    if (designId) {
      handleNext(); // Automatically move to the next step after selecting a design
    }
  };

  const handleNext = () => {
    if (currentStep === 2 && selectedEventTypeId) {
      setCurrentStep(3); // Move to ChooseDesigns
    } else if (currentStep === 3 && selectedDesignId) {
      setCurrentStep(4); // Move to ChoosePackage
    } else {
      console.error("No selection made.");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1); // Go back to the previous step
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
        {currentStep === 4 && selectedDesignId && (
          <ChoosePackage
            designId={selectedDesignId}
            onNext={() => {
              // Handle the next step after ChoosePackage
              console.log("Proceeding to the next step after ChoosePackage");
            }}
            onBack={handleBack}
          />
        )}
      </section>
    </main>
  );
};

export default RootPage;
