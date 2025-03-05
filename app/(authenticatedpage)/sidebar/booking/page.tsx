/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useBookEventMutation } from "@/store/endpoints/apiSlice";
import Modal from "./modal";
import Image from "next/image";
import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useLogoutUserMutation } from "@/store/endpoints/apiSlice";
import { logoutUser } from "@/store/authReducer"; // Import the logoutUser action

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
  const dispatch = useDispatch();
  const [payload, setPayload] = useState<Payload | null>(null);
  const [bookEvent, { isLoading, isError }] = useBookEventMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const translations = useSelector((state: any) => state.language.translations);

  // Fetch user info and check for token expiration

  const [logoutUserMutation] = useLogoutUserMutation(); // Initialize the mutation

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
        console.log("API Response:", JSON.stringify(result, null, 2));
        setIsModalOpen(true);
        sessionStorage.clear();
      } catch (error: any) {
        try {
          // Call the logout mutation
          await logoutUserMutation({}).unwrap();

          // Dispatch the logout action to update Redux state
          dispatch(logoutUser());

          // Clear cookies (if applicable)
          Cookies.remove("token");
          Cookies.remove("user-info");
          Cookies.remove("token_creation_time");

          // Redirect to login page with the payload
          router.push(
            `/login?payload=${encodeURIComponent(JSON.stringify(payload))}`
          );
        } catch (logoutError) {
          console.error("Logout failed:", logoutError);
        }

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
                  <span className="font-semibold">
                    {translations.booking.place}:
                  </span>{" "}
                  {payload.place}
                </p>
                <p>
                  <span className="font-semibold">
                    {translations.booking.date}:
                  </span>{" "}
                  {payload.date}
                </p>
                <p>
                  <span className="font-semibold">
                    {translations.booking.city}:
                  </span>{" "}
                  {payload.city}
                </p>
                <p>
                  <span className="font-semibold">
                    {translations.booking.eventType}:
                  </span>{" "}
                  {payload.eventType || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">
                    {translations.booking.eventDesign}:
                  </span>{" "}
                  {payload.eventDesign || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">
                    {translations.booking.eventPackage}:
                  </span>{" "}
                  {payload.eventPackage || "Not specified"}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-primary text-lg font-medium mb-2">
                {translations.booking.packageAddition}
              </h2>
              <div className="text-tertiary text-base space-y-2">
                {payload?.eventPackageAdditions?.length > 0 ? (
                  payload.eventPackageAdditions.map((addition, index) => (
                    <p key={index}>
                      <span className="font-semibold">
                        {translations.booking.addition} {index + 1}:
                      </span>{" "}
                      {addition.additionTypeName || "Unnamed addition"}
                    </p>
                  ))
                ) : (
                  <p>{translations.booking.noAddition}</p>
                )}
              </div>

              <div>
                <h2 className="text-primary text-lg font-medium mb-2">
                  {translations.booking.extraServices}
                </h2>
                <div className="text-tertiary text-base space-y-2">
                  {payload.extraServices.length > 0 ? (
                    payload.extraServices.map((service, index) => (
                      <p key={index}>
                        <span className="font-semibold">
                          {translations.booking.service} {index + 1}:
                        </span>{" "}
                        {service.packageName || "Unnamed service"}
                      </p>
                    ))
                  ) : (
                    <p>{translations.booking.noService}</p>
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
              {isLoading
                ? translations.booking.submitting
                : translations.booking.submitOrder}
            </motion.button>
            {isError && (
              <p className="text-red-500 mt-2">
                {translations.booking.tryBooking}
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
            className="next-btn text-primary hover:bg-secondary bg-primary hover:text-white mt-6"
            variants={{
              hover: {
                scale: 1.05,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
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
