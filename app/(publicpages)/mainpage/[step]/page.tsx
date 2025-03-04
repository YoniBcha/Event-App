"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookingPage from "@/components/bookingstep/BookingPage";
import ChooseDesigns from "@/components/bookingstep/ChooseDesigns";
import ChoosePackage from "@/components/bookingstep/ChoosePackage";
import PackageDetails from "@/components/bookingstep/PackageDetails";
import ChooseAdditional from "@/components/bookingstep/ChooseAdditional";
import ExtraService from "@/components/bookingstep/ExtraService";
import PersonalDataComonents from "@/components/bookingstep/PersonalData";
import { motion, AnimatePresence } from "framer-motion";
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

export default function MainPage() {
  const { step } = useParams<{ step: string }>();
  const currentStep = parseInt(step, 10); // Convert step to number
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
  const [extraServices, setExtraServices] = useState<ExtraServiceData[]>([]);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const authenticateUser = useSelector((state: any) => state.auth.user);

  // Retrieve state from sessionStorage on component mount
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    // Retrieve state from sessionStorage
    const storedBookingData = sessionStorage.getItem("bookingData");
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    }

    const storedSelectedDesignId = sessionStorage.getItem("selectedDesignId");
    if (storedSelectedDesignId) {
      setSelectedDesignId(storedSelectedDesignId);
    }

    const storedSelectedPackageId = sessionStorage.getItem("selectedPackageId");
    if (storedSelectedPackageId) {
      setSelectedPackageId(storedSelectedPackageId);
    }

    const storedEventPackageAdditions = sessionStorage.getItem(
      "eventPackageAdditions"
    );
    if (storedEventPackageAdditions) {
      setEventPackageAdditions(JSON.parse(storedEventPackageAdditions));
    }

    const storedExtraServices = sessionStorage.getItem("extraServices");
    if (storedExtraServices) {
      setExtraServices(JSON.parse(storedExtraServices));
    }

    const storedPersonalData = sessionStorage.getItem("personalData");
    if (storedPersonalData) {
      setPersonalData(JSON.parse(storedPersonalData));
    }

    setLoading(false); // Set loading to false after retrieving state
  }, []);

  // Handle direct navigation
  useEffect(() => {
    if (loading) return; // Do nothing if still loading

    if (currentStep === 2 && !bookingData.event) {
      router.push("/mainpage/1");
    }

    if (currentStep === 3 && !selectedDesignId) {
      router.push("/mainpage/2");
    }

    if (currentStep === 4 && !selectedPackageId) {
      router.push("/mainpage/3");
    }

    if (currentStep === 5 && !selectedPackageId) {
      router.push("/mainpage/4");
    }

    if (currentStep === 6 && !eventPackageAdditions) {
      router.push("/mainpage/5");
    }

    if (currentStep === 7 && !extraServices) {
      router.push("/mainpage/6");
    }

    if (currentStep === 8 && !personalData) {
      router.push("/mainpage/7");
    }
  }, [
    currentStep,
    bookingData,
    selectedDesignId,
    selectedPackageId,
    eventPackageAdditions,
    extraServices,
    personalData,
    router,
    loading,
  ]);

  const handleBookingData = (data: FormData) => {
    // Ensure date is a valid Date object
    const updatedData = {
      ...data,
      date: data.date ? new Date(data.date) : null, // Convert to Date object if not null
    };
    setBookingData(updatedData);
    sessionStorage.setItem("bookingData", JSON.stringify(updatedData));
    router.push("/mainpage/2");
  };

  const handleDesignSelect = (designId: string | null) => {
    setSelectedDesignId(designId);
    sessionStorage.setItem("selectedDesignId", designId || "");
    router.push("/mainpage/3");
  };

  const handlePackageSelect = (packageId: string | null) => {
    setSelectedPackageId(packageId);
    sessionStorage.setItem("selectedPackageId", packageId || "");
    router.push("/mainpage/4");
  };

  const handlePackageDetailsNext = () => {
    router.push("/mainpage/5");
  };

  const handleAdditionalDataSubmit = (data: {
    eventPackageAdditions: EventPackageAddition[];
  }) => {
    setEventPackageAdditions(data.eventPackageAdditions);
    sessionStorage.setItem(
      "eventPackageAdditions",
      JSON.stringify(data.eventPackageAdditions)
    );
    router.push("/mainpage/6");
  };

  const handleExtraServiceSelect = (selectedService: ExtraServiceData) => {
    setExtraServices((prev) => {
      const updatedServices = [...prev, selectedService];
      sessionStorage.setItem("extraServices", JSON.stringify(updatedServices));
      router.push("/mainpage/7");
      return updatedServices;
    });
  };

  const handlePersonalDataSubmit = async (data: PersonalData) => {
    try {
      setPersonalData(data);

      const payload = {
        place: bookingData.place,
        date: bookingData.date, // Check if date is valid
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
      router.push(`/mainpage/${currentStep - 1}`);
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
}
