/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBookEventMutation } from "@/store/endpoints/apiSlice"; // ✅ RTK Query API

interface EventPackageAddition {
  additionId: string;
  additionTypeName: string;
  quantity: number;
}

interface ExtraService {
  servicesProvider_id: string;
  packageName: string;
}

interface Payload {
  place: "indoor" | "outdoor" | "both";
  date: string;
  city: string;
  eventType: string;
  eventDesign: string;
  eventPackage: string;
  eventPackageAdditions: EventPackageAddition[];
  extraServices: ExtraService[];
  personalData: {
    fullName: string;
    mobileNumber: string;
    secondMobileNumber?: string;
    favoriteColors: string;
    notes?: string;
  };
}

const MyOrders = () => {
  const searchParams = useSearchParams();
  const [payload, setPayload] = useState<Payload | null>(null);
  const [bookEvent, { isLoading }] = useBookEventMutation();

  useEffect(() => {
    const payloadParam = searchParams.get("payload");
    if (payloadParam) {
      try {
        const decodedPayload = JSON.parse(decodeURIComponent(payloadParam));

        // Ensuring the structure matches the expected API format
        const formattedPayload: Payload = {
          place: decodedPayload.place || "both",
          date: decodedPayload.date || new Date().toISOString(),
          city: decodedPayload.city || "",
          eventType: decodedPayload.eventType || "",
          eventDesign: decodedPayload.eventDesign || "",
          eventPackage: decodedPayload.eventPackage || "",
          eventPackageAdditions:
            decodedPayload.eventPackageAdditions?.map((item: any) => ({
              additionId: item.additionId || "",
              additionTypeName: item.additionTypeName || "",
              quantity: item.quantity || 1,
            })) || [],
          extraServices:
            decodedPayload.extraServices?.map((service: any) => ({
              servicesProvider_id: service.servicesProvider_id || "",
              packageName: service.packageName || "",
            })) || [],
          personalData: {
            fullName: decodedPayload.personalData?.fullName || "",
            mobileNumber: decodedPayload.personalData?.mobileNumber || "",
            secondMobileNumber:
              decodedPayload.personalData?.secondMobileNumber || "",
            favoriteColors: decodedPayload.personalData?.favoriteColors || "",
            notes: decodedPayload.personalData?.notes || "",
          },
        };

        setPayload(formattedPayload);
      } catch (error) {
        console.error("Error parsing payload:", error);
        toast.error("Invalid payload data.");
      }
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!payload) {
      toast.error("No payload data available to submit.");
      return;
    }

    try {
      const response = await bookEvent(payload).unwrap();
      toast.success("Event booked successfully!");
      console.log("API Response:", response);
    } catch (err: any) {
      console.error("Error booking event:", err);
      toast.error(
        err.data?.message || "Failed to book event. Please try again."
      );
    }
  };

  return (
    <div>
      <h1>My Orders</h1>
      {payload && (
        <div>
          <h2>Payload Data:</h2>
          <pre>{JSON.stringify(payload, null, 2)}</pre>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              backgroundColor: isLoading ? "#ccc" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Submitting..." : "Submit Payload"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
