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

  const handleNext = () => {
    if (currentStep === 2 && selectedEventTypeId) {
      setCurrentStep(3);
    } else if (currentStep === 3 && selectedDesignId) {
      setCurrentStep(4);
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
            onNext={() => {
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
