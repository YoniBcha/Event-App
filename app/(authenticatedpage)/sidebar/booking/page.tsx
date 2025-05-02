/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useRef, useState } from "react";
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
  fullData: any;
  place: string;
  date: string;
  city: string;
  priceDetails: any;
  priceBeforeVat: number;
  discountAmount: number;
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
    providerName: string;
    translatedPackageName: string;
    serviceName: string;
    translatedServiceName: string;
  }[];

  personalData: {
    fullName: string;
    mobileNumber: string;
    age: number;
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
  const [fullData, setFulldata] = useState<any | null>(null);
  const [bookEvent, { isLoading, isError }] = useBookEventMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const translations = useSelector((state: any) => state.language.translations);
  const [preBookEvent] = usePreBookEventMutation(); // Use the preBookEvent mutation
  const [logoutUserMutation] = useLogoutUserMutation();
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const submitButtonRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToButton, setHasScrolledToButton] = useState(false);

  // Scroll handler
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (submitButtonRef.current && !hasScrolledToButton && !acceptedTerms) {
  //       const buttonRect = submitButtonRef.current.getBoundingClientRect();
  //       const isVisible = buttonRect.top <= window.innerHeight * 0.75; // When 75% of viewport scrolled

  //       if (isVisible) {
  //         setShowTermsModal(true);
  //         setHasScrolledToButton(true);
  //         // Remove listener after first trigger
  //         window.removeEventListener("scroll", handleScroll);
  //       }
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [acceptedTerms, hasScrolledToButton]);

  // Also check on initial render if already scrolled
  // useEffect(() => {
  //   if (submitButtonRef.current && !acceptedTerms) {
  //     const buttonRect = submitButtonRef.current.getBoundingClientRect();
  //     const isVisible = buttonRect.top <= window.innerHeight;

  //     if (isVisible) {
  //       setShowTermsModal(true);
  //       setHasScrolledToButton(true);
  //     }
  //   }
  // }, [acceptedTerms]);

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
            setPayloads(result.bookedEvent);
            setFulldata(result.fullData);
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
                    fullData?.eventType?.nameOfEvent || "", // Correct path to event type name
                    fullData?.eventType?.translatedNameOfEvent || undefined
                  ),
                },
                {
                  label: translations.booking.eventDesign,
                  value: renderValue(
                    fullData?.eventDesign?.eventDesign || "", // Correct path to event design name
                    fullData?.eventDesign?.translatedEventDesign || undefined
                  ),
                },
                {
                  label: translations.booking.eventPackage,
                  value: renderValue(
                    fullData?.eventPackage?.packageName || "",
                    fullData?.eventPackage?.translatedPackageName || undefined
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
                  <div
                    key={index}
                    className="flex items-center gap-2 overflow-hidden"
                  >
                    <span className="font-medium text-gray-600 flex-shrink-0">
                      {index + 1}:
                    </span>
                    <div className="flex items-baseline gap-1 min-w-0">
                      <span className="text-gray-800 truncate">
                        {renderValue(
                          addition.additionTypeName,
                          addition.translatedTypeName
                        )}
                      </span>
                      <span className="text-gray-600 whitespace-nowrap text-sm flex-shrink-0">
                        (Qx: {addition.quantity})
                      </span>
                    </div>
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
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <span className="font-medium text-gray-600">
                      {translations.booking.service} {index + 1}:
                    </span>

                    <p>
                      <span className="text-gray-500">
                        {translations.cart.lables.serviceName}:
                      </span>{" "}
                      {renderValue(
                        service.serviceName,
                        service.translatedServiceName
                      )}
                    </p>

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
                  label: translations.booking.age,
                  value: payloads.personalData.age,
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
                      {/* <span>
                        {payloads.personalData.favoriteColors.join(", ")}
                      </span> */}
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
                      {/* <span>{payloads.personalData.dressColor.join(", ")}</span> */}
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
              <div className="flex flex-col items-center">
                <span className="font-medium flex w-full text-start text-gray-600 ">
                  {translations.booking.eventPackage}:
                </span>
                <table className="w-full  rounded-lg overflow-hidden">
                  <thead className="bg-primary">
                    <tr className="bg-primary-50">
                      <th className="py-3 px-4 text-left font-medium text-gray-600 border-b border-gray-200">
                        {translations.booking.package}
                      </th>
                      <th className="py-3 px-4 text-right font-medium text-gray-600 border-b border-gray-200">
                        {translations.booking.price}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="border border-gray-200">
                    <tr className=" border-b border-gray-200">
                      <td className="py-3 px-4">
                        {renderValue(
                          payloads.priceDetails.eventPackage.name,
                          payloads.priceDetails.eventPackage
                            .translatedPackageName
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="flex items-center justify-end">
                          {payloads.priceDetails.eventPackage.price}
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
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Additions */}
              {payloads.priceDetails.additions.length > 0 && (
                <div className="flex flex-col items-center w-full">
                  <span className="font-medium w-full text-start text-gray-600 mb-2">
                    {translations.booking.addition}:
                  </span>
                  <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[700px] md:min-w-0 rounded-lg">
                      <thead>
                        <tr className="bg-primary">
                          <th className="py-2 px-4 text-left font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">
                            {translations.booking.addition}
                          </th>
                          <th className="py-2 px-4 text-left font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">
                            {translations.booking.type}
                          </th>
                          <th className="py-2 px-4 text-right font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">
                            {translations.booking.quantity}
                          </th>
                          <th className="py-2 px-4 text-right font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">
                            {translations.booking.unit_price}
                          </th>
                          <th className="py-2 px-4 text-right font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">
                            {translations.booking.total}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="border border-gray-200">
                        {payloads.priceDetails.additions.map(
                          (addition: any, index: number) => (
                            <tr
                              key={index}
                              className={`
                  ${
                    index !== payloads.priceDetails.additions.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }
                `}
                            >
                              <td className="py-2 px-4 whitespace-nowrap">
                                {renderValue(
                                  addition.name,
                                  addition.translatedAdditionName
                                )}
                              </td>
                              <td className="py-2 px-4 whitespace-nowrap">
                                {renderValue(
                                  addition.type,
                                  addition.translatedTypeName
                                )}
                              </td>
                              <td className="py-2 px-4 text-right whitespace-nowrap">
                                {addition.quantity}
                              </td>
                              <td className="py-2 px-4 text-right whitespace-nowrap">
                                {addition.unitPrice}
                                <Image
                                  src="/images/SR.png"
                                  alt="SR"
                                  width={15}
                                  height={3}
                                  className={`ml-1 inline ${
                                    currentLocale === "ar" ? "scale-x-[-1]" : ""
                                  }`}
                                />
                              </td>
                              <td className="py-2 px-4 text-right whitespace-nowrap">
                                {addition.totalPrice}
                                <Image
                                  src="/images/SR.png"
                                  alt="SR"
                                  width={15}
                                  height={3}
                                  className={`ml-1 inline ${
                                    currentLocale === "ar" ? "scale-x-[-1]" : ""
                                  }`}
                                />
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Extra Services */}
              {payloads.priceDetails.extraServices.length > 0 && (
                <div className="flex flex-col items-center w-full">
                  <span className="font-medium w-full text-start text-gray-600 mb-2">
                    {translations.booking.extraServices}:
                  </span>
                  <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[600px] md:min-w-0 rounded-lg">
                      <thead>
                        <tr className="bg-primary">
                          <th className="py-2 px-4 text-left font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">
                            {translations.booking.service}
                          </th>
                          <th className="py-2 px-4 text-left font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">
                            {translations.serviceName}
                          </th>
                          <th className="py-2 px-4 text-left font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">
                            {translations.booking.provider}
                          </th>
                          <th className="py-2 px-4 text-right font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">
                            {translations.booking.price}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="border border-gray-200">
                        {payloads.priceDetails.extraServices.map(
                          (service: any, index: number) => (
                            <tr
                              key={index}
                              className={`
                  ${
                    index !== payloads.priceDetails.extraServices.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }
                `}
                            >
                              <td className="py-2 px-4 whitespace-nowrap">
                                {renderValue(
                                  service.package,
                                  service.translatedPackageName
                                )}
                              </td>
                              <td className="py-2 px-4 whitespace-nowrap">
                                {renderValue(
                                  service.serviceName,
                                  service.translatedServiceName
                                )}
                              </td>
                              <td className="py-2 px-4 whitespace-nowrap">
                                {service.provider}
                              </td>
                              <td className="py-2 px-4 text-right whitespace-nowrap">
                                {service.price}
                                <Image
                                  src="/images/SR.png"
                                  alt="SR"
                                  width={15}
                                  height={3}
                                  className={`ml-1 inline ${
                                    currentLocale === "ar" ? "scale-x-[-1]" : ""
                                  }`}
                                />
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Total Price Before VAT */}
              <div className="flex flex-row w-full items-center justify-center">
                <div className="md:w-1/2"></div>
                <table className="md:w-1/2 w-full overflow-x-auto">
                  <tbody className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    {payloads?.discountAmount > 0 && (
                      <tr className="border-b border-gray-200">
                        <td className="py-2 pl-4 border-r border-gray-200">
                          <span className="font-medium text-gray-600">
                            {translations.discount}:
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-right">
                          <span className="text-gray-800 flex items-center justify-end">
                            {payloads.discountAmount}
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
                        </td>
                      </tr>
                    )}

                    {/* Total Price Before VAT */}
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pl-4 border-r border-gray-200">
                        <span className="font-medium text-gray-600">
                          {translations.total_price_before_vat}:
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right">
                        <span className="text-gray-800 flex items-center justify-end">
                          {payloads.priceBeforeVat}
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
                      </td>
                    </tr>

                    {/* VAT Amount */}
                    <tr className="border-b border-gray-200">
                      <td className="py-2 pl-4 border-r border-gray-200">
                        <span className="font-medium text-gray-600">
                          {translations.vat_15}:
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right">
                        <span className="text-gray-800 flex items-center justify-end">
                          {payloads.vatAmount}
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
                      </td>
                    </tr>

                    {/* Total Price After VAT */}
                    <tr>
                      <td className="py-2 pl-4 border-r border-gray-200">
                        <span className="font-medium text-gray-600">
                          {translations.total_price_after_vat}:
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right">
                        <span className="text-gray-800 flex items-center justify-end">
                          {payloads.priceAfterVat}
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
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div
            ref={submitButtonRef}
            className="flex justify-center gap-4 mt-8 scroll-mt-16" // Added scroll-margin
          >
            <motion.button
              onClick={() => {
                // if (!acceptedTerms) {
                //   setShowTermsModal(true);
                //   // Scroll to terms if not visible
                //   submitButtonRef.current?.scrollIntoView({
                //     behavior: "smooth",
                //   });
                //   toast.error(translations.booking.mustAcceptTerms);
                //   return;
                // }
                handleSubmit();
              }}
              disabled={isLoading}
              className={`px-3 py-2 rounded-xl text-lg font-semibold transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark text-secondary"
              }`}
              whileHover={!isLoading ? { scale: 1.05 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
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
      {/* Terms and Conditions */}
    </div>
  );
};

export default MyOrders;

//  <Modal
//    isOpen={showTermsModal}
//    onClose={() => {
//      if (!acceptedTerms) {
//        toast.error(translations.booking.mustAcceptTerms);
//      } else {
//        setShowTermsModal(false);
//      }
//    }}
//  >
//    <div className="  bg-white flex flex-col items-center p-8 rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto">
//      <h2 className="text-2xl font-bold  ">
//        {translations.booking.termsAndConditions}
//      </h2>

//      {/* Terms content */}
//      <div className="  p-4   border-gray-100">
//        <h2 className="text-center text-xl font-bold underline">
//          {translations.terms.title}
//        </h2>
//        <ul className="list-disc text-primary pl-6 mt-4">
//          {Array.isArray(translations.terms.items) &&
//            translations.terms.items.map((item: string, index: number) => (
//              <li key={index}>{item}</li>
//            ))}
//        </ul>
//      </div>

//      <label className="flex items-center cursor-pointer">
//        <div className="relative">
//          <input
//            type="checkbox"
//            id="modalAcceptTerms"
//            checked={acceptedTerms}
//            onChange={(e) => {
//              setAcceptedTerms(e.target.checked);
//              if (e.target.checked) {
//                toast.success(translations.booking.termsAccepted);
//              }
//            }}
//            className="sr-only" // Hide the default checkbox
//          />
//          <div
//            className={`block w-5 h-5 rounded border-2 border-primary ${
//              acceptedTerms ? "bg-primary" : "bg-white"
//            }`}
//          >
//            {acceptedTerms && (
//              <svg
//                className="absolute inset-0 w-5 h-5 text-white"
//                viewBox="0 0 20 20"
//                fill="none"
//              >
//                <path
//                  d="M6 10L9 13L14 7"
//                  stroke="currentColor"
//                  strokeWidth="2"
//                  strokeLinecap="round"
//                  strokeLinejoin="round"
//                />
//              </svg>
//            )}
//          </div>
//        </div>
//        <span className="ml-2 text-gray-700">
//          {translations.booking.iAgreeToTerms}
//        </span>
//      </label>

//      <div className="flex justify-center gap-4">
//        <button
//          onClick={() => {
//            if (acceptedTerms) {
//              setShowTermsModal(false);
//            } else {
//              toast.error(translations.booking.mustAcceptTerms);
//            }
//          }}
//          className={`px-6 py-2 rounded-lg transition-colors ${
//            acceptedTerms
//              ? "bg-primary text-white hover:bg-primary-dark"
//              : "bg-gray-300 text-gray-500 cursor-not-allowed"
//          }`}
//          disabled={!acceptedTerms}
//        >
//          {translations.booking.continueToOrder}
//        </button>
//      </div>
//    </div>
//  </Modal>;
