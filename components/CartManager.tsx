/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCart } from "@/store/cartSlice";

export default function CartManager() {
  const dispatch = useDispatch();

  const syncCart = () => {
    const items: Record<string, any> = {};

    // Sync all booking-related session storage items
    const bookingData = sessionStorage.getItem("bookingData");
    if (bookingData) items.bookingData = JSON.parse(bookingData);

    const selectedDesignId = sessionStorage.getItem("selectedDesignId");
    if (selectedDesignId) items.selectedDesignId = JSON.parse(selectedDesignId);

    const selectedPackageId = sessionStorage.getItem("selectedPackageId");
    if (selectedPackageId)
      items.selectedPackageId = JSON.parse(selectedPackageId);

    const eventPackageAdditions = sessionStorage.getItem(
      "eventPackageAdditions"
    );
    if (eventPackageAdditions)
      items.eventPackageAdditions = JSON.parse(eventPackageAdditions);

    const extraServices = sessionStorage.getItem("extraServices");
    if (extraServices) items.extraServices = JSON.parse(extraServices);

    const personalData = sessionStorage.getItem("personalData");
    if (personalData) items.personalData = JSON.parse(personalData);

    const payload = sessionStorage.getItem("payload");
    if (payload) items.payload = JSON.parse(payload);

    // Determine if we should show the cart
    const hasIncompleteBooking =
      bookingData ||
      selectedDesignId ||
      selectedPackageId ||
      eventPackageAdditions ||
      extraServices ||
      (personalData && !sessionStorage.getItem("bookingCompleted"));

    // console.log("Cart sync results:", {
    //   items,
    //   hasIncompleteBooking,
    // }); // Debug log

    // Update Redux store
    dispatch(
      updateCart({
        items,
        visible: !!hasIncompleteBooking,
      })
    );
  };

  useEffect(() => {
    // Initial sync
    syncCart();

    // Listen for storage changes from other tabs
    window.addEventListener("storage", syncCart);

    // Add interval to check for same-tab changes (500ms is a good balance)
    const interval = setInterval(syncCart, 500);

    // Custom event listener for same-tab updates
    const handleCustomCartUpdate = () => {
      console.log("Received custom cart update event");
      syncCart();
    };
    window.addEventListener("cart-updated", handleCustomCartUpdate);

    return () => {
      // Cleanup all listeners
      window.removeEventListener("storage", syncCart);
      clearInterval(interval);
      window.removeEventListener("cart-updated", handleCustomCartUpdate);
    };
  }, [dispatch]);

  return null;
}
