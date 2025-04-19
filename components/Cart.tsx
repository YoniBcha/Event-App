/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import { clearCart } from "@/store/cartSlice";
import { useRouter, usePathname } from "next/navigation";

export default function Cart() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { items, visible } = useSelector((state: any) => state.cart);
  const [isOpen, setIsOpen] = useState(false);

  const countCompletedSteps = () => {
    let count = 1;
    if (items.bookingData) count++;
    if (items.selectedDesignId) count++;
    if (items.selectedPackageId) count++;
    if (items.eventPackageAdditions) count++;
    if (items.extraServices) count++;
    if (items.personalData) count++;
    return Math.min(count, 7);
  };

  const getResumeStep = () => {
    if (items.personalData) return 7;
    if (items.extraServices) return 6;
    if (items.eventPackageAdditions) return 5;
    if (items.selectedPackageId) return 4;
    if (items.selectedDesignId) return 3;
    if (items.bookingData) return 2;
    return 1;
  };

  const handleResume = () => {
    const step = getResumeStep();
    router.push(`/mainpage/${step}`);
    setIsOpen(false);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    router.push("/mainpage/1");
    setIsOpen(false);
  };

  const handleToggleCart = () => {
    setIsOpen(!isOpen);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="relative z-50">
      {/* Cart Icon Button */}
      <button
        onClick={handleToggleCart}
        className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 relative group"
      >
        <FaShoppingCart size={20} />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {countCompletedSteps()}
        </span>
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {pathname.includes("/mainpage/") ? "View Booking" : "Resume Booking"}
        </span>
      </button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={handleToggleCart}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Cart Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                  <h3 className="text-xl font-bold text-gray-800">
                    Booking Summary
                  </h3>
                  <button
                    onClick={handleToggleCart}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <IoMdClose size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Always show resume button when not on the booking flow */}
                    {!pathname.includes("/mainpage/") && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0 }}
                        className="mb-6"
                      >
                        <button
                          onClick={handleResume}
                          className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                        >
                          Resume Booking (Step {getResumeStep()})
                        </button>
                      </motion.div>
                    )}

                    {items.bookingData && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          1. Event Details
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p>
                            <span className="text-gray-500">City:</span>{" "}
                            {items.bookingData.city}
                          </p>
                          <p>
                            <span className="text-gray-500">Place:</span>{" "}
                            {items.bookingData.place}
                          </p>
                          <p>
                            <span className="text-gray-500">Event:</span>{" "}
                            {items.bookingData.event}
                          </p>
                          {items.bookingData.date && (
                            <p>
                              <span className="text-gray-500">Date:</span>{" "}
                              {new Date(
                                items.bookingData.date
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {items.selectedDesignId && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          2. Selected Design
                        </h4>
                        <p className="text-sm">
                          <span className="text-gray-500">Design ID:</span>{" "}
                          {items.selectedDesignId}
                        </p>
                      </motion.div>
                    )}

                    {items.selectedPackageId && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          3. Selected Package
                        </h4>
                        <p className="text-sm">
                          <span className="text-gray-500">Package ID:</span>{" "}
                          {items.selectedPackageId}
                        </p>
                      </motion.div>
                    )}

                    {items.eventPackageAdditions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          4. Package Additions
                        </h4>
                        <ul className="space-y-2 text-sm">
                          {items.eventPackageAdditions.map(
                            (item: any, index: number) => (
                              <li
                                key={index}
                                className="flex justify-between items-center"
                              >
                                <span>{item.additionTypeName}</span>
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                                  x{item.quantity}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </motion.div>
                    )}

                    {items.extraServices?.extraServices && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          5. Extra Services
                        </h4>
                        <ul className="space-y-2 text-sm">
                          {items.extraServices.extraServices.map(
                            (service: any, index: number) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                {service.packageName}
                              </li>
                            )
                          )}
                        </ul>
                      </motion.div>
                    )}

                    {items.personalData && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          6. Personal Info
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p>
                            <span className="text-gray-500">Name:</span>{" "}
                            {items.personalData.fullName}
                          </p>
                          <p>
                            <span className="text-gray-500">Phone:</span>{" "}
                            {items.personalData.mobileNumber}
                          </p>
                          <p>
                            <span className="text-gray-500">People:</span>{" "}
                            {items.personalData.noOfPeople}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="p-4 border-t sticky bottom-0 bg-white"
                >
                  <button
                    onClick={handleClearCart}
                    className="w-full py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    Clear All Booking Data
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
