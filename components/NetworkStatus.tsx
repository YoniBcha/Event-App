/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Mark this as a Client Component
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const NetworkStatus = () => {
  const translations = useSelector((state: any) => state.language.translations);
  useEffect(() => {
    let offlineToastId: string | undefined; // Store the ID of the offline toast

    // Function to check network status
    const handleNetworkChange = () => {
      if (navigator.onLine) {
        // If the network is restored, dismiss the offline toast
        if (offlineToastId) {
          toast.dismiss(offlineToastId); // Dismiss the specific offline toast
          offlineToastId = undefined; // Reset the toast ID
        }
        toast.success(translations.back_online, {
          position: "top-center",
        });
      } else {
        // If the network is offline, show the offline toast and store its ID
        offlineToastId = toast.error(translations.offline, {
          position: "top-center",
          duration: Infinity, // Keep the toast visible until dismissed
        });
      }
    };

    // Check initial network status
    if (!navigator.onLine) {
      offlineToastId = toast.error(translations.offline, {
        position: "top-center",
        duration: Infinity, // Keep the toast visible until dismissed
      });
    }

    // Add event listeners for online/offline events
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, []);

  return <Toaster />; // Render the Toaster component for displaying notifications
};

export default NetworkStatus;
