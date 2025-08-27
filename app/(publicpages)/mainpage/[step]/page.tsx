/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  useLazyGetUserInfoQuery,
  useLogoutUserMutation,
} from "@/store/endpoints/apiSlice";
import { logoutUser } from "@/store/authReducer";
import ProgressSteps from "@/components/ProgressSteps";

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

interface PersonalData {
  fullName: string;
  mobileNumber: string;
  secondMobileNumber?: string;
  favoriteColors: string[];
  notes?: string;
  noOfPeople: number;
  imageOfPlace: string[]; // Store URLs instead of File objects
  dressColor: string[];
  place: string;
  couponCode?: string;
}
interface SelectedDesign {
  id: string;
  name: string;
}
interface selectedPackage {
  id: string;
  name: string;
}
export default function MainPage() {
  const { step } = useParams<{ step: string }>();
  const currentStep = parseInt(step, 10); // Convert step to number
  const router = useRouter();
  const [cartItems, setCartItems] = useState<Record<string, any>>({});
  const [showCart, setShowCart] = useState(false);
  const dispatch = useDispatch();
  const [logoutUserMutation] = useLogoutUserMutation();
  const [getUserInfo, { data: userInfo }] = useLazyGetUserInfoQuery();
  const [bookingData, setBookingData] = useState<FormData>({
    city: "",
    place: "",
    event: "",
    date: null,
  });
  const [selectedDesignId, setSelectedDesignId] =
    useState<SelectedDesign | null>(null);
  const [selectedPackageId, setSelectedPackageId] =
    useState<selectedPackage | null>(null);
  const [eventPackageAdditions, setEventPackageAdditions] = useState<
    EventPackageAddition[]
  >([]);
  const [extraServices, setExtraServices] = useState<any>([]);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const authenticateUser = useSelector((state: any) => state.auth.user);
  const [hasAutoSelectedDesign, setHasAutoSelectedDesign] = useState(false);

  // Retrieve state from sessionStorage on component mount
  const [loading, setLoading] = useState(true); // Add a loading state
  useEffect(() => {
    const updateCart = () => {
      const items: Record<string, any> = {};

      const bookingData = sessionStorage.getItem("bookingData");
      if (bookingData) items.bookingData = JSON.parse(bookingData);

      const selectedDesignId = sessionStorage.getItem("selectedDesignId");
      if (selectedDesignId) items.selectedDesignId = selectedDesignId;

      const selectedPackageId = sessionStorage.getItem("selectedPackageId");
      if (selectedPackageId) items.selectedPackageId = selectedPackageId;

      const eventPackageAdditions = sessionStorage.getItem(
        "eventPackageAdditions"
      );
      if (eventPackageAdditions)
        items.eventPackageAdditions = JSON.parse(eventPackageAdditions);

      const extraServices = sessionStorage.getItem("extraServices");
      if (extraServices) items.extraServices = JSON.parse(extraServices);

      const personalData = sessionStorage.getItem("personalData");
      if (personalData) items.personalData = JSON.parse(personalData);

      setCartItems(items);
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    return () => window.removeEventListener("storage", updateCart);
  }, []);

  const clearCart = () => {
    sessionStorage.clear();
    setCartItems({});
  };

  useEffect(() => {
    // Retrieve state from sessionStorage
    const storedBookingData = sessionStorage.getItem("bookingData");
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData));
    }

    const storedSelectedDesignId = sessionStorage.getItem("selectedDesignId");
    if (storedSelectedDesignId) {
      setSelectedDesignId(JSON.parse(storedSelectedDesignId));
    }

    const storedSelectedPackageId = sessionStorage.getItem("selectedPackageId");
    if (storedSelectedPackageId) {
      setSelectedPackageId(JSON.parse(storedSelectedPackageId));
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

  // Handle pre-selected design from design gallery
  useEffect(() => {
    if (loading || hasAutoSelectedDesign) return;

    // Check if we're on the design selection step (step 2) and have a pre-selected design
    if (currentStep === 2 && bookingData.event) {
      const preSelectedDesign = sessionStorage.getItem("preSelectedDesign");

      if (preSelectedDesign) {
        try {
          const designData = JSON.parse(preSelectedDesign);
          if (designData && designData.length >= 2) {
            const [designId, designName] = designData;

            // Create selected design object
            const selectedDesign = {
              id: designId,
              name: designName,
            };

            // Set the selected design
            setSelectedDesignId(selectedDesign.id);
            sessionStorage.setItem(
              "selectedDesignId",
              JSON.stringify(selectedDesign)
            );

            // Mark that we've auto-selected to prevent infinite loop
            setHasAutoSelectedDesign(true);

            // Remove the pre-selected design from sessionStorage
            sessionStorage.removeItem("preSelectedDesign");

            // Navigate to the next step (package selection)
            router.push("/mainpage/3");
          }
        } catch (error) {
          console.error("Error parsing preSelectedDesign:", error);
        }
      }
    }
  }, [currentStep, bookingData, loading, hasAutoSelectedDesign, router]);

  // Handle direct navigation
  useEffect(() => {
    if (loading) return; // Do nothing if still loading

    if (currentStep === 2 && !bookingData.event) {
      router.push("/mainpage/1");
    }

    if (currentStep === 3 && !selectedDesignId && !bookingData.event) {
      router.push("/mainpage/2");
    }

    if (
      currentStep === 4 &&
      !selectedPackageId &&
      !selectedDesignId &&
      !bookingData.event
    ) {
      router.push("/mainpage/3");
    }

    if (
      currentStep === 5 &&
      !selectedPackageId &&
      !selectedDesignId &&
      !bookingData.event
    ) {
      router.push("/mainpage/4");
    }

    if (
      currentStep === 6 &&
      !selectedPackageId &&
      !selectedDesignId &&
      !bookingData.event
    ) {
      router.push("/mainpage/5");
    }

    if (
      currentStep === 7 &&
      !selectedPackageId &&
      !selectedDesignId &&
      !bookingData.event
    ) {
      router.push("/mainpage/6");
    }

    if (
      currentStep === 8 &&
      !personalData &&
      !selectedPackageId &&
      !selectedDesignId &&
      !bookingData.event
    ) {
      router.push("/mainpage/7");
    }

    if (currentStep < 1 || currentStep > 8) {
      router.push("/mainpage/1");
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

  const handleDesignSelect = (selectedDesign: any) => {
    setSelectedDesignId(selectedDesign.id);
    sessionStorage.setItem("selectedDesignId", JSON.stringify(selectedDesign));
    router.push("/mainpage/3");
  };

  const handlePackageSelect = (selectedPackage: any) => {
    setSelectedPackageId(selectedPackage?.id);
    sessionStorage.setItem(
      "selectedPackageId",
      JSON.stringify(selectedPackage) || ""
    );
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

  const handleExtraServiceSelect = (selectedService: any) => {
    setExtraServices(selectedService);

    sessionStorage.setItem("extraServices", JSON.stringify(selectedService));
    router.push("/mainpage/7");
  };

  const handlePersonalDataSubmit = async (data: PersonalData) => {
    try {
      setPersonalData(data);

      const payload = {
        place: bookingData.place,
        date: bookingData.date, // Check if date is valid
        city: bookingData.city,
        eventType: bookingData.event,
        eventDesign: selectedDesignId?.id,
        eventPackage: selectedPackageId?.id,
        eventPackageAdditions: eventPackageAdditions,
        extraServices: extraServices.extraServices,
        personalData: data,
        couponCode: data.couponCode,
      };

      sessionStorage.setItem("payload", JSON.stringify(payload));

      const userInfoResponse = (await getUserInfo({})) as any;

      if (
        userInfoResponse?.message === "Session expired" ||
        userInfoResponse?.message === "User Unauthorized" ||
        userInfoResponse?.error?.data?.message === "Session expired" ||
        userInfoResponse?.error?.data?.message === "User Unauthorized"
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
    } catch (error: any) {
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
      <ProgressSteps currentStep={currentStep} totalSteps={7} />
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
                eventDesign={selectedDesignId?.id}
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
                packageId={selectedPackageId?.id}
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
                packageId={selectedPackageId.id ?? ""}
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
