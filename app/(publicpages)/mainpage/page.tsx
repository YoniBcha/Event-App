/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import BookingPage from "@/components/bookingstep/BookingPage";

import ChooseDesigns from "@/components/bookingstep/ChooseDesigns";
import ChoosePackage from "@/components/bookingstep/ChoosePackage";
import PackageDetails from "@/components/bookingstep/PackageDetails";
import ChooseAdditional from "@/components/bookingstep/ChooseAdditional";
import ExtraService from "@/components/bookingstep/ExtraService";
import PersonalDataComonents from "@/components/bookingstep/PersonalData";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion
import {
  useGetUserInfoQuery,
  useLogoutUserMutation,
} from "@/store/endpoints/apiSlice";
import { logoutUser } from "@/store/authReducer";
interface FormData {
  city: string;
  place: string;
  event: string;
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
  const [extraServices, setExtraServices] = useState<ExtraServiceData[]>([]);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutUserMutation] = useLogoutUserMutation();
  const { data: userInfo, error: userInfoError } = useGetUserInfoQuery<any>({});
  const [bookingData, setBookingData] = useState<FormData>({
    city: "",
    place: "",
    event: "",
    date: null,
  });
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );
  const [eventPackageAdditions, setEventPackageAdditions] = useState<
    EventPackageAddition[]
  >([]);

  const authenticateUser = useSelector((state: any) => state.auth.user);

  const handleBookingData = (data: FormData) => {
    setBookingData(data);
    setCurrentStep(2);
  };

  const handleDesignSelect = (designId: string | null) => {
    setSelectedDesignId(designId);
    setCurrentStep(3); // Updated step number
  };

  const handlePackageSelect = (packageId: string | null) => {
    setSelectedPackageId(packageId);
    setCurrentStep(4); // Updated step number
  };

  const handlePackageDetailsNext = () => {
    setCurrentStep(5); // Updated step number
  };

  const handleAdditionalDataSubmit = (data: {
    eventPackageAdditions: EventPackageAddition[];
  }) => {
    setEventPackageAdditions(data.eventPackageAdditions);
    setCurrentStep(6); // Updated step number
  };

  const handleExtraServiceSelect = (selectedService: ExtraServiceData) => {
    setExtraServices((prev) => {
      const updatedServices = [...prev, selectedService];
      setCurrentStep(7); // Updated step number
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
        eventType: bookingData.event,
        eventDesign: selectedDesignId,
        eventPackage: selectedPackageId,
        eventPackageAdditions: eventPackageAdditions,
        extraServices: extraServices.flatMap(
          (service) => service.extraServices
        ),
        personalData: data,
      };

      console.log("Payload to be sent:", payload);

      sessionStorage.setItem("payload", JSON.stringify(payload));

      if (
        userInfo?.message === "Session expired" ||
        userInfo?.message === "User Unauthorized" ||
        userInfoError?.data?.message === "Session expired" ||
        userInfoError?.data?.message === "User Unauthorized"
      ) {
        await logoutUserMutation({}).unwrap();
        dispatch(logoutUser());
        router.push(
          `/login?payload=${encodeURIComponent(JSON.stringify(payload))}`
        );
      } else {
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
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: currentLocale === "en" ? 100 : -100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: currentLocale === "en" ? -100 : 100 },
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

          {currentStep === 2 && bookingData.event && (
            <motion.div
              key="step-2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <ChooseDesigns
                id={bookingData.event}
                onNext={handleDesignSelect}
                onBackClick={handleBack}
              />
            </motion.div>
          )}

          {currentStep === 3 && selectedDesignId && (
            <motion.div
              key="step-3"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <ChoosePackage
                place={bookingData.place}
                eventDesign={selectedDesignId}
                eventType={bookingData.event}
                onNext={handlePackageSelect}
                onBackClick={handleBack}
              />
            </motion.div>
          )}

          {currentStep === 4 && selectedPackageId && (
            <motion.div
              key="step-4"
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

          {currentStep === 5 && selectedPackageId && (
            <motion.div
              key="step-5"
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

          {currentStep === 6 && (
            <motion.div
              key="step-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ duration: 0.3 }}
            >
              <ExtraService
                onExtraServiceSelect={handleExtraServiceSelect}
                onBack={handleBack}
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
              <PersonalDataComonents onSubmit={handlePersonalDataSubmit} />
            </motion.div>
          )}

          {currentStep === 8 && personalData && (
            <motion.div
              key="step-8"
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
