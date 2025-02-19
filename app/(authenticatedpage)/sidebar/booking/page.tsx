/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBookEventMutation } from "@/store/endpoints/apiSlice";
import Modal from "./modal";
import Image from "next/image";
import React, { Suspense } from "react";
import router from "next/router";

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
  const [payload, setPayload] = useState<Payload | null>(null);
  const [bookEvent, { isLoading, isError }] = useBookEventMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        router.push("/sidebar/my-order");
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
      <h1 className="text-primary text-2xl font-bold mb-6">My Orders</h1>
      {payload ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-5">
            <div>
              <h2 className="text-primary text-lg font-medium mb-2">
                Event Details
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
                    Personal Data
                  </h2>
                  <div className="text-tertiary text-base space-y-2">
                    <p>
                      <span className="font-semibold">Full Name:</span>{" "}
                      {payload.personalData.fullName}
                    </p>
                    <p>
                      <span className="font-semibold">Mobile Number:</span>{" "}
                      {payload.personalData.mobileNumber}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Second Mobile Number:
                      </span>{" "}
                      {payload.personalData.secondMobileNumber ||
                        "Not provided"}
                    </p>
                    <p>
                      <span className="font-semibold">Favorite Colors:</span>{" "}
                      {payload.personalData.favoriteColors}
                    </p>
                    <p>
                      <span className="font-semibold">Notes:</span>{" "}
                      {payload.personalData.notes || "No notes"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-2 rounded-lg ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark"
              } text-white transition-colors duration-200`}
            >
              {isLoading ? "Submitting..." : "Submit Payload"}
            </button>
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
            Thank you
          </h2>
          <p className="text-base text-primary text-center">
            The reservation process has been completed successfully. Please
            complete your personal information to view the costs.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default MyOrders;
