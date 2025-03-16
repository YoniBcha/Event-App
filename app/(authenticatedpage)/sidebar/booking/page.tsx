/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  useBookEventMutation,
  usePreBookEventMutation,
} from "@/store/endpoints/apiSlice";
import Modal from "./modal";
import Image from "next/image";
import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useLogoutUserMutation } from "@/store/endpoints/apiSlice";
import { logoutUser } from "@/store/authReducer";
import toast from "react-hot-toast";

interface Payload {
  place: string;
  date: string;
  city: string;
  priceDetails: any;
  priceBeforeVat: number;
  translatedEventType: string;
  translatedEventDesign: string;
  translatedEventPackage: string;
  translatedTypeName: string;
  translatedPackageName: string;
  priceAfterVat: number;
  vatAmount: number;
  eventType: string | null;
  eventDesign: string | null;
  eventPackage: string | null;
  eventPackageAdditions: {
    additionId: string;
    translatedTypeName: string;

    additionTypeName: string;
    quantity: number;
  }[];
  extraServices: {
    servicesProvider_id: string;
    packageName: string;
    translatedPackageName: string;
  }[];

  personalData: {
    fullName: string;
    mobileNumber: string;
    secondMobileNumber?: string;
    favoriteColors: string[];
    dressColor: string[];
    notes?: string;
    noOfPeople: number;
    imageOfPlace: string[];
    place: string;
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
  const [payloads, setPayloads] = useState<Payload | null>(null);
  const [bookEvent, { isLoading, isError }] = useBookEventMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const translations = useSelector((state: any) => state.language.translations);
  const [preBookEvent] = usePreBookEventMutation(); // Use the preBookEvent mutation
  const [logoutUserMutation] = useLogoutUserMutation();
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  useEffect(() => {
    let payloadParam = searchParams.get("payload");

    if (!payloadParam) {
      payloadParam = localStorage.getItem("bookingPayload");
    }

    if (payloadParam) {
      try {
        const decodedPayload = JSON.parse(decodeURIComponent(payloadParam));
        console.log("Decoded Payload:", decodedPayload);
        setPayload(decodedPayload);

        // Call the preBookEvent mutation on page load
        preBookEvent(decodedPayload)
          .unwrap()
          .then((result: any) => {
            console.log("PreBook Event Result:", result);
            setPayloads(result.bookedEvent);
          })
          .catch((error: any) => {
            console.error("PreBook Event Error:", error);
          });
      } catch (error) {
        console.error("Failed to parse payload:", error);
      }
    } else {
      console.error("No payload found in URL or localStorage");
    }
  }, [searchParams, preBookEvent]);
  const handleDelete = () => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("payload");
    window.history.replaceState(null, "", newUrl.toString());
    sessionStorage.clear();
    toast.success("You Have Deleted the Order");
    router.push("/mainpage/1");
  };
  useEffect(() => {
    let payloadParam = searchParams.get("payload");

    if (!payloadParam) {
      payloadParam = localStorage.getItem("bookingPayload");
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

        localStorage.removeItem("bookingPayload");

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("payload");
        window.history.replaceState(null, "", newUrl.toString());

        setIsModalOpen(true);
        sessionStorage.clear();
      } catch (error: any) {
        if (
          error.data.message === "User Unauthorized" ||
          error.data.message === "Session expired"
        ) {
          try {
            await logoutUserMutation({}).unwrap();
            dispatch(logoutUser());

            Cookies.remove("token");
            Cookies.remove("user-info");
            Cookies.remove("token_creation_time");

            router.push(
              `/login?payload=${encodeURIComponent(JSON.stringify(payload))}`
            );
          } catch (logoutError) {
            console.error("Logout failed:", logoutError);
          }
        }
        console.error("Error booking event:", error);
        toast.error(error.data.message);
      }
    } else {
      console.error("No payload available to submit.");
      toast.error("No payload available to submit.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    router.replace("/sidebar/my-orders");
  };
  const renderValue = (
    defaultValue: string,
    translatedValue: string | undefined
  ) => {
    return currentLocale === "ar" && translatedValue
      ? translatedValue
      : defaultValue;
  };
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl shadow-lg">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        {translations.myOrders}
      </h1>
      {payloads ? (
        <div className="space-y-8">
          {/* Event Details */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {translations.booking.eventDetails}
            </h2>
            <div className="text-gray-700 space-y-3">
              {[
                { label: translations.booking.place, value: payloads.place },
                {
                  label: translations.booking.date,
                  value: new Date(payloads.date).toLocaleDateString(),
                },
                { label: translations.booking.city, value: payloads.city },
                {
                  label: translations.booking.eventType,
                  value: renderValue(
                    payloads.eventType || "", // Provide a default value to avoid null
                    payloads.translatedEventType || undefined // Ensure it remains undefined if null
                  ),
                },
                {
                  label: translations.booking.eventDesign,
                  value: renderValue(
                    payloads.eventDesign || "",
                    payloads.translatedEventDesign || undefined
                  ),
                },
                {
                  label: translations.booking.eventPackage,
                  value: renderValue(
                    payloads.eventPackage || "",
                    payloads.translatedEventPackage || undefined
                  ),
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="font-medium text-gray-600 w-40">
                    {item.label}:
                  </span>
                  <span className="text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Package Additions */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {translations.booking.packageAddition}
            </h2>
            <div className="text-gray-700 space-y-3">
              {payloads?.eventPackageAdditions?.length > 0 ? (
                payloads.eventPackageAdditions.map((addition, index) => (
                  <div key={index} className="flex items-center">
                    <span className="font-medium text-gray-600">
                      {translations.booking.addition} {index + 1}:
                    </span>
                    <span className="ml-2 text-gray-800">
                      {renderValue(
                        addition.additionTypeName,
                        addition.translatedTypeName
                      )}{" "}
                      (Quantity: {addition.quantity})
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-600">
                  {translations.booking.noAddition}
                </div>
              )}
            </div>
          </div>

          {/* Extra Services */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {translations.booking.extraServices}
            </h2>
            <div className="text-gray-700 space-y-3">
              {payloads.extraServices.length > 0 ? (
                payloads.extraServices.map((service, index) => (
                  <div key={index} className="flex items-center">
                    <span className="font-medium text-gray-600">
                      {translations.booking.service} {index + 1}:
                    </span>
                    <span className="ml-2 text-gray-800">
                      {renderValue(
                        service.packageName,
                        service.translatedPackageName
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-600">
                  {translations.booking.noService}
                </div>
              )}
            </div>
          </div>

          {/* Personal Data */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {translations.booking.personalData}
            </h2>
            <div className="text-gray-700 space-y-3">
              {[
                {
                  label: translations.booking.fullName,
                  value: payloads.personalData.fullName,
                },
                {
                  label: translations.booking.mobileNumber,
                  value: payloads.personalData.mobileNumber,
                },
                {
                  label: translations.booking.secondMobileNumber,
                  value:
                    payloads.personalData.secondMobileNumber || "Not provided",
                },
                {
                  label: translations.booking.favoriteColor,
                  value: (
                    <div className="flex items-center">
                      {payloads.personalData.favoriteColors.map(
                        (color, index) => (
                          <span
                            key={index}
                            className="inline-block w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        )
                      )}
                      <span>
                        {payloads.personalData.favoriteColors.join(", ")}
                      </span>
                    </div>
                  ),
                },
                {
                  label: translations.booking.dressColor,
                  value: (
                    <div className="flex items-center">
                      {payloads.personalData.dressColor.map((color, index) => (
                        <span
                          key={index}
                          className="inline-block w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                      <span>{payloads.personalData.dressColor.join(", ")}</span>
                    </div>
                  ),
                },
                {
                  label: translations.booking.notes,
                  value: payloads.personalData.notes || "No notes",
                },
                {
                  label: translations.booking.number_of_people,
                  value: payloads.personalData.noOfPeople,
                },
                {
                  label: translations.booking.place,
                  value: payloads.personalData.place,
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="font-medium text-gray-600 w-40">
                    {item.label}:
                  </span>
                  <span className="text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Images of Place */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {translations.booking.imageOfPlace}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {payloads.personalData.imageOfPlace.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  className="relative overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={imageUrl}
                    alt={`Place Image ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Price Details */}
          <div className="bg-secondary p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {translations.priceDetails}
            </h2>
            <div className="text-gray-700 space-y-3">
              {/* Event Package */}
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-48">
                  {translations.booking.eventPackage}:
                </span>
                <span className="text-gray-800 flex items-center">
                  {renderValue(
                    payloads.priceDetails.eventPackage.name,
                    payloads.priceDetails.eventPackage.translatedPackageName
                  )}{" "}
                  ({payloads.priceDetails.eventPackage.price}{" "}
                  <Image
                    src="/images/SR.png"
                    alt="SR"
                    width={15}
                    height={3}
                    className={`ml-1 ${
                      currentLocale === "ar" ? "scale-x-[-1]" : ""
                    }`}
                  />
                  )
                </span>
              </div>

              {/* Additions */}
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-48">
                  {translations.booking.addition}:{" "}
                </span>
                <span className="text-gray-800">
                  {payloads.priceDetails.additions
                    .map((addition: any) =>
                      renderValue(
                        `${addition.name} - ${addition.type} (${addition.quantity} x ${addition.unitPrice} = ${addition.totalPrice})`,
                        `${addition.translatedAdditionName} ${addition.translatedTypeName} (${addition.quantity} x ${addition.unitPrice} = ${addition.totalPrice})`
                      )
                    )
                    .join(", ")}
                </span>
              </div>

              {/* Extra Services */}
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-48">
                  {translations.booking.extraServices}:
                </span>
                <span className="text-gray-800">
                  {payloads.priceDetails.extraServices
                    .map((service: any) =>
                      renderValue(
                        `${service.package} (${service.price}) - ${service.provider}`,
                        `${service.translatedPackageName} (${service.price}  ) - ${service.provider}`
                      )
                    )
                    .join(", ")}
                </span>
              </div>

              {/* Total Price Before VAT */}
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-48">
                  {translations.total_price_before_vat}:
                </span>
                <span className="text-gray-800 flex items-center">
                  {payloads.priceBeforeVat}{" "}
                  <Image
                    src="/images/SR.png"
                    alt="SR"
                    width={15}
                    height={3}
                    className={`ml-1 ${
                      currentLocale === "ar" ? "scale-x-[-1]" : ""
                    }`}
                  />
                </span>
              </div>

              {/* VAT Amount */}
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-48">
                  {translations.vat_15}:
                </span>
                <span className="text-gray-800 flex items-center">
                  {payloads.vatAmount}{" "}
                  <Image
                    src="/images/SR.png"
                    alt="SR"
                    width={15}
                    height={3}
                    className={`ml-1 ${
                      currentLocale === "ar" ? "scale-x-[-1]" : ""
                    }`}
                  />
                </span>
              </div>

              {/* Total Price After VAT */}
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-48">
                  {translations.total_price_after_vat}:
                </span>
                <span className="text-gray-800 flex items-center">
                  {payloads.priceAfterVat}{" "}
                  <Image
                    src="/images/SR.png"
                    alt="SR"
                    width={15}
                    height={3}
                    className={`ml-1 ${
                      currentLocale === "ar" ? "scale-x-[-1]" : ""
                    }`}
                  />
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center space-x-4">
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-3 py-2 rounded-xl text-lg hover:bg-secondary hover:text-primary font-semibold ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark text-secondary"
              } transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading
                ? translations.booking.submitting
                : translations.booking.submitOrder}
            </motion.button>

            {/* Delete Button */}
            <motion.button
              onClick={handleDelete}
              className="px-3 py-2 rounded-xl text-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations.delete}
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="text-gray-600">{translations.loadingPayload}</div>
      )}

      {/* Success Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col items-center bg-secondary p-8 rounded-xl shadow-lg">
          <Image
            src="/images/thanks icon.png"
            alt="Success"
            width={150}
            height={150}
            className="mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {translations.booking.thankYou}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {translations.booking.thankYouSubtitle}
          </p>
          <motion.button
            onClick={closeModal}
            className="px-8 py-3 bg-primary text-secondary rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {translations.booking.done}
          </motion.button>
        </div>
      </Modal>
    </div>
  );
};

export default MyOrders;
