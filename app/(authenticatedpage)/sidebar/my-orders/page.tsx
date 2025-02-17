/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  useEffect(() => {
    const payloadParam = searchParams.get("payload");
    if (payloadParam) {
      const decodedPayload = JSON.parse(decodeURIComponent(payloadParam));
      setPayload(decodedPayload);
    }
  }, [searchParams]);

  const sendPayloadToAPI = async (payload: Payload) => {
    try {
      const response = await fetch(
        "https://eventapp-back-cr86.onrender.com/api/v1/event/bookEvent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to book event");
      }

      const result = await response.json();
      console.log("API Response:", result);
      toast.success("Event booked successfully!");
    } catch (error) {
      console.error("Error booking event:", error);
      toast.error("Failed to book event. Please try again.");
    }
  };

  const handleSubmit = () => {
    if (payload) {
      sendPayloadToAPI(payload);
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
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit Payload
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
