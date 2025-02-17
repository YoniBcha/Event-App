/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBookEventMutation } from "@/store/endpoints/apiSlice"; 

interface Payload {
  place: string;
  date: string;
  city: string;
  eventType: string | null;
  eventDesign: string | null;
  eventPackage: string | null;
  eventPackageAdditions: any[];
  extraServices: any[];
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
  const [bookEvent, { isLoading, isError, isSuccess }] = useBookEventMutation();

  useEffect(() => {
    const payloadParam = searchParams.get("payload");
    if (payloadParam) {
      const decodedPayload = JSON.parse(decodeURIComponent(payloadParam));
      setPayload(decodedPayload);
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    if (payload) {
      try {
        const result = await bookEvent(payload).unwrap(); // Use the mutation
        console.log("API Response:", result);
        toast.success("Event booked successfully!");
      } catch (error) {
        console.error("Error booking event:", error);
        toast.error("Failed to book event. Please try again.");
      }
    } else {
      toast.error("No payload data available to submit.");
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
          {isError && <p style={{ color: "red" }}>Error booking event. Please try again.</p>}
          {isSuccess && <p style={{ color: "green" }}>Event booked successfully!</p>}
        </div>
      )}
    </div>
  );
};

export default MyOrders;