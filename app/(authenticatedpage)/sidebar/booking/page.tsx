/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useBookEventMutation } from "@/store/endpoints/apiSlice";
import Modal from "./modal";
import Image from "next/image";
import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Define the Payload interface
interface Payload {
  place: string;
  date: string;
  city: string;
  eventType: string | null;
  eventDesign: string | null;
  eventPackage: string | null;
  eventPackageAdditions: {
    additionId: string;
    additionTypeName: string;
    quantity: number;
  }[];
  extraServices: {
    servicesProvider_id: string;
    packageName: string;
  }[];
  personalData: {
    fullName: string;
    mobileNumber: string;
    secondMobileNumber?: string;
    favoriteColors: string;
    notes?: string;
  };
}

const MyOrders = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyOrdersContent />
    </Suspense>
  );
};

const MyOrdersContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [payload, setPayload] = useState<Payload | null>(null);
  const [bookEvent, { isLoading, isError }] = useBookEventMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const translations = useSelector((state: any) => state.language.translations);

  useEffect(() => {
    let payloadParam = searchParams.get("payload");

    if (!payloadParam) {
      payloadParam = localStorage.getItem("bookingPayload"); // Retrieve from localStorage
    }

    if (payloadParam) {
      try {
        const decodedPayload = JSON.parse(decodeURIComponent(payloadParam));
        console.log("Decoded Payload:", decodedPayload);
        setPayload(decodedPayload);
      } catch (error) {
        console.error("Failed to parse payload:", error);
      }
    } else {
      console.error("No payload found in URL or localStorage");
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    if (payload) {
      try {
        const result = await bookEvent(payload).unwrap();
        console.log("API Response:", result);
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error booking event:", error);
      }
    } else {
      console.error("No payload available to submit.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-primary text-2xl font-bold mb-6">
        {translations.myOrders}
      </h1>
      {payload ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-5">
            <div>
              <h2 className="text-primary text-lg font-medium mb-2">
                {translations.booking.eventDetails}
              </h2>
              <div className="text-tertiary text-base space-y-2">
                <p>
                  <span className="font-semibold">Place:</span> {payload.place}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {payload.date}
                </p>
                <p>
                  <span className="font-semibold">City:</span> {payload.city}
                </p>
                <p>
                  <span className="font-semibold">Event Type:</span>{" "}
                  {payload.eventType || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Event Design:</span>{" "}
                  {payload.eventDesign || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Event Package:</span>{" "}
                  {payload.eventPackage || "Not specified"}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-primary text-lg font-medium mb-2">
                Event Package Additions
              </h2>
              <div className="text-tertiary text-base space-y-2">
                {payload.eventPackageAdditions.length > 0 ? (
                  payload.eventPackageAdditions.map((addition, index) => (
                    <p key={index}>
                      <span className="font-semibold">
                        Addition {index + 1}:
                      </span>{" "}
                      {addition.additionTypeName || "Unnamed addition"}
                    </p>
                  ))
                ) : (
                  <p>No additions selected.</p>
                )}
              </div>

              <div>
                <h2 className="text-primary text-lg font-medium mb-2">
                  Extra Services
                </h2>
                <div className="text-tertiary text-base space-y-2">
                  {payload.extraServices.length > 0 ? (
                    payload.extraServices.map((service, index) => (
                      <p key={index}>
                        <span className="font-semibold">
                          Service {index + 1}:
                        </span>{" "}
                        {service.packageName || "Unnamed service"}
                      </p>
                    ))
                  ) : (
                    <p>No extra services selected.</p>
                  )}
                </div>
                <div>
                  <h2 className="text-primary text-lg font-medium mb-2">
                    {translations.booking.personalData}
                  </h2>
                  <div className="text-tertiary text-base space-y-2">
                    <p>
                      <span className="font-semibold">
                        {translations.booking.fullName}:
                      </span>{" "}
                      {payload.personalData.fullName}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {translations.booking.mobileNumber}:
                      </span>{" "}
                      {payload.personalData.mobileNumber}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {translations.booking.secondMobileNumber}:
                      </span>{" "}
                      {payload.personalData.secondMobileNumber ||
                        "Not provided"}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {translations.booking.favoriteColor}:
                      </span>{" "}
                      {payload.personalData.favoriteColors}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {translations.booking.notes}:
                      </span>{" "}
                      {payload.personalData.notes || "No notes"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary  hover:bg-secondary hover:text-primary"
              } text-white transition-colors duration-200`}
              variants={{
                hover: {
                  scale: 1.05,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  borderColor: "#a57a6a",

                  transition: { duration: 0.2, ease: "easeInOut" },
                },
                tap: {
                  scale: 0.95,
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                  transition: { duration: 0.1, ease: "easeInOut" },
                },
              }}
              whileHover="hover"
              whileTap="tap"
            >
              {isLoading ? "Submitting..." : translations.booking.submitOrder}
            </motion.button>
            {isError && (
              <p className="text-red-500 mt-2">
                Error booking event. Please try again.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading payload...</p>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col items-center justify-center gap-3">
          <Image
            src="/zip/Checkmark.png"
            alt="Success"
            width={40}
            height={40}
          />
          <h2 className="text-center text-2xl md:text-3xl text-primary font-bold mb-4">
            {translations.booking.thankYou}
          </h2>
          <p className="text-base text-primary text-center">
            {translations.booking.thankYouSubtitle}
          </p>
          <motion.button
            onClick={() => {
              closeModal();
              router.push("/sidebar/my-orders");
            }}
            className="next-btn text-primary hover:bg-[#faebdc] bg-primary hover:text-white mt-6"
            variants={{
              hover: {
                scale: 1.05,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                borderColor: "#a57a6a",
                color: "#a57a6a",
                transition: { duration: 0.2, ease: "easeInOut" },
              },
              tap: {
                scale: 0.95,
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                transition: { duration: 0.1, ease: "easeInOut" },
              },
            }}
            whileHover="hover"
            whileTap="tap"
          >
            {translations.booking.nextBtn}
          </motion.button>
        </div>
      </Modal>
    </div>
  );
};

export default MyOrders;
