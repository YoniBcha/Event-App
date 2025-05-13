/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import { clearCart } from "@/store/cartSlice";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function Cart() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { items, visible } = useSelector((state: any) => state.cart);
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );

  const translations = useSelector((state: any) => state.language.translations);
  const places = [
    {
      value: "outdoor",
      label: "Outdoor",
      translatedLabel: "في الهواء الطلق",
    },
    {
      value: "indoor",
      label: "Indoor",
      translatedLabel: "داخلي",
    },
    {
      value: "both",
      label: "Both",
      translatedLabel: "كلاهما",
    },
  ];

  const saudiCities = [
    { value: "Jeddah", label: "Jeddah", translatedLabel: "جدة" },
    { value: "Makkah", label: "Makkah", translatedLabel: "مكة" },
    { value: "Riyadh", label: "Riyadh", translatedLabel: "الرياض" },
  ];
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
  const renderValue = (
    defaultValue: string,
    translatedValue: string | undefined
  ) => {
    return currentLocale === "ar" && translatedValue
      ? translatedValue
      : defaultValue;
  };
  return (
    <div className="relative z-50">
      {/* Cart Icon Button */}
      <button
        onClick={handleToggleCart}
        className="bg-primary flex justify-center items-center text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 relative group"
      >
         <Image
                src={"/images/icon-buy1.png"}
                alt={currentLocale === "ar" ? "Arrow Left" : "Arrow Right"}
                width={20} // Adjust width as needed
                height={20} // Adjust height as needed
                className={`text-xl items-center ${
                  currentLocale === "ar" ? "scale-x-[-1]" : ""
                }`} // Add any additional styling here
              />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {countCompletedSteps()}
        </span>
        {/* <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {pathname.includes("/mainpage/")
            ? translations.cart.viewBooking
            : translations.cart.resumeBooking}
        </span> */}
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
                    {translations.cart.bookingSummary}
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
                          {translations.cart.resumeButton} {getResumeStep()})
                        </button>
                      </motion.div>
                    )}

                    {items.bookingData && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-50 p-4 rounded-lg cursor-pointer"
                        onClick={() => {
                          router.push("/mainpage/1");
                          setIsOpen(false);
                        }}
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          1. {translations.cart.sections.eventDetails}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p>
                            <span className="text-gray-500">
                              {translations.cart.lables.event}:
                            </span>{" "}
                            {items.bookingData.eventName}
                          </p>
                          <p>
                            <span className="text-gray-500">
                              {translations.cart.lables.city}:
                            </span>{" "}
                            {items?.bookingData?.city
                              ? renderValue(
                                  saudiCities.find(
                                    (city) =>
                                      city.value === items.bookingData.city
                                  )?.label || "",
                                  saudiCities.find(
                                    (city) =>
                                      city.value === items.bookingData.city
                                  )?.translatedLabel || ""
                                )
                              : ""}
                          </p>
                          <p>
                            <span className="text-gray-500">
                              {translations.cart.lables.place}:
                            </span>{" "}
                            {renderValue(
                              places.find(
                                (place) =>
                                  place.value === items?.bookingData?.place
                              )?.label || "",
                              places.find(
                                (place) =>
                                  place.value === items?.bookingData?.place
                              )?.translatedLabel || ""
                            )}
                          </p>

                          {items.bookingData.date && (
                            <p>
                              <span className="text-gray-500">
                                {translations.cart.lables.date}:
                              </span>{" "}
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
                        className="bg-gray-50 p-4 rounded-lg cursor-pointer"
                        onClick={() => {
                          router.push("/mainpage/2");
                          setIsOpen(false);
                        }}
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          2. {translations.cart.sections.selectedDesign}
                        </h4>
                        <p className="text-sm">
                          <span className="text-gray-500">
                            {translations.cart.lables.designName}:
                          </span>{" "}
                          {items?.selectedDesignId?.name}
                        </p>
                      </motion.div>
                    )}

                    {items.selectedPackageId && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-50 p-4 rounded-lg cursor-pointer"
                        onClick={() => {
                          router.push("/mainpage/3");
                          setIsOpen(false);
                        }}
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          3. {translations.cart.sections.selectedPackage}
                        </h4>
                        <p className="text-sm">
                          <span className="text-gray-500">
                            {translations.cart.lables.packageName}:
                          </span>{" "}
                          {items.selectedPackageId.name}
                        </p>
                      </motion.div>
                    )}

                    {items?.eventPackageAdditions?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-50 p-4 rounded-lg cursor-pointer"
                        onClick={() => {
                          router.push("/mainpage/5");
                          setIsOpen(false);
                        }}
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          4. {translations.cart.sections.packageAdditions}
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

                    {items.extraServices?.extraServices?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-50 p-4 rounded-lg cursor-pointer"
                        onClick={() => {
                          router.push("/mainpage/6");
                          setIsOpen(false);
                        }}
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          5. {translations.cart.sections.extraServices}
                        </h4>
                        <ul className="space-y-4 text-sm">
                          {items.extraServices.extraServices.map(
                            (service: any, idx: number) => (
                              <li
                                key={idx}
                                className="bg-gray-50 p-3 rounded-lg"
                              >
                                <div className="grid grid-cols-2 gap-2">
                                  <p>
                                    <span className="text-gray-500">
                                      {translations.cart.lables.serviceName}:
                                    </span>{" "}
                                    {renderValue(
                                      service.serviceName,
                                      service.translatedServiceName
                                    )}
                                  </p>

                                  {/* <p>
                                    <span className="text-gray-500">
                                      Provider ID:
                                    </span>{" "}
                                    {service.servicesProvider_id}
                                  </p> */}
                                  <p>
                                    <span className="text-gray-500">
                                      {translations.cart.lables.providerName}:
                                    </span>{" "}
                                    {service.providerName}
                                  </p>
                                  <p>
                                    <span className="text-gray-500">
                                      {translations.cart.lables.packageName}:
                                    </span>{" "}
                                    {renderValue(
                                      service.packageName,
                                      service.translatedPackageName
                                    )}
                                  </p>
                                </div>
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
                        className="bg-gray-50 p-4 rounded-lg cursor-pointer"
                        onClick={() => {
                          router.push("/mainpage/7");
                          setIsOpen(false);
                        }}
                      >
                        <h4 className="font-semibold text-primary mb-2">
                          6. {translations.cart.sections.personalInfo}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p>
                            <span className="text-gray-500">
                              {translations.cart.lables.name}:
                            </span>{" "}
                            {items.personalData.fullName || "—"}
                          </p>
                          <p>
                            <span className="text-gray-500">
                              {translations.cart.lables.phone}:
                            </span>{" "}
                            {items.personalData.mobileNumber || "—"}
                          </p>
                          <p>
                            <span className="text-gray-500">
                              {translations.cart.lables.secondPhone}:
                            </span>{" "}
                            {items.personalData.secondMobileNumber || "—"}
                          </p>
                          <p>
                            <span className="text-gray-500">
                              {translations.cart.lables.people}:
                            </span>{" "}
                            {items.personalData.noOfPeople}
                          </p>
                          <p>
                            <span className="text-gray-500">
                              {translations.cart.lables.place}:
                            </span>{" "}
                            {items.personalData.place || "—"}
                          </p>
                          <p>
                            <span className="text-gray-500">
                              {translations.cart.lables.age}:
                            </span>{" "}
                            {items.personalData.age || "—"}
                          </p>
                          {/* <p>
                            <span className="text-gray-500">Birth Date:</span>{" "}
                            {items.personalData.birthDate
                              ? new Date(
                                  items.personalData.birthDate
                                ).toLocaleDateString()
                              : "—"}
                          </p> */}
                          <div className="col-span-2">
                            <span className="text-gray-500">
                              {translations.cart.lables.favoriteColors}:
                            </span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {items.personalData.favoriteColors.length > 0 ? (
                                items.personalData.favoriteColors.map(
                                  (color: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="w-6 h-6 rounded-full border"
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    />
                                  )
                                )
                              ) : (
                                <span className="ml-2">—</span>
                              )}
                            </div>
                          </div>

                          <div className="col-span-2">
                            <span className="text-gray-500">
                              {translations.cart.lables.dressColors}:
                            </span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {items.personalData.dressColor.length > 0 ? (
                                items.personalData.dressColor.map(
                                  (color: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="w-6 h-6 rounded-full border"
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    />
                                  )
                                )
                              ) : (
                                <span className="ml-2">—</span>
                              )}
                            </div>
                          </div>

                          <div className="col-span-2">
                            <span className="text-gray-500">
                              {translations.cart.lables.notes}:
                            </span>{" "}
                            {items.personalData.notes || "—"}
                          </div>
                          {items.personalData.imageOfPlace.length > 0 && (
                            <div className="col-span-2">
                              <span className="text-gray-500">
                                {translations.cart.lables.imagesOfPlace}:
                              </span>
                              <div className="mt-2 flex space-x-2 overflow-x-auto">
                                {items.personalData.imageOfPlace.map(
                                  (url: string, i: number) => (
                                    <img
                                      key={i}
                                      src={url}
                                      alt={`Place ${i + 1}`}
                                      className="w-24 h-16 object-cover rounded"
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          )}
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
                    {}
                    {translations.cart.clearButton}
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
