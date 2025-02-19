/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux"; // Import useSelector to access the store
import BookingPage from "@/components/bookingstep/BookingPage";
import EventType from "@/components/bookingstep/EventType";
import ChooseDesigns from "@/components/bookingstep/ChooseDesigns";
import ChoosePackage from "@/components/bookingstep/ChoosePackage";
import PackageDetails from "@/components/bookingstep/PackageDetails";
import ChooseAdditional from "@/components/bookingstep/ChooseAdditional";
import ExtraService from "@/components/bookingstep/ExtraService";
import PersonalDataComonents from "@/components/bookingstep/PersonalData";

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
    setCurrentStep(6);
  };

  const handleAdditionalDataSubmit = (data: {
    eventPackageAdditions: EventPackageAddition[];
  }) => {
    console.log(
      "Received Event Package Additions in Parent:",
      data.eventPackageAdditions
    );
    setEventPackageAdditions(data.eventPackageAdditions);
    setCurrentStep(7);
  };

  const handleExtraServiceSelect = (selectedService: ExtraServiceData) => {
    setExtraServices((prev) => {
      const updatedServices = [...prev, selectedService];
      console.log("Updated Extra Services:", updatedServices);
      setCurrentStep(8);
      return updatedServices;
    });
  };

  const handlePersonalDataSubmit = async (data: PersonalData) => {
    try {
      console.log("Received Personal Data:", data);
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

      console.log("Payload to be sent:", payload);
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

  return (
    <main className="w-full">
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
        {currentStep === 8 && (
          <PersonalDataComonents onSubmit={handlePersonalDataSubmit} />
        )}
        {currentStep === 9 && personalData && (
          <div>
            <h2>Personal Data Submitted:</h2>
            <pre>{JSON.stringify(personalData, null, 2)}</pre>
          </div>
        )}
      </section>
    </main>
  );
};

export default RootPage;
