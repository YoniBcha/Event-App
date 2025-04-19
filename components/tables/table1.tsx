/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import moment from "moment";
import Image from "next/image";
import { useSelector } from "react-redux";

// Define the type for personal data and additional fields
interface PersonalData {
  fullName: string;
  mobileNumber: string;
  secondMobileNumber: string;
  favoriteColors: string[];
  dressColor: string[];
  notes: string;
  place: string;
}

interface Addition {
  additionId: string;
  typeOfAddition: string;
  translatedTypeOfAddition?: string;
  quantity: number;
  _id: string;
}

interface EventDetails {
  packageName: string;
  packagePrice: number;
  translatedPackageName?: string;
  status: string;
  place: string;
  city: string;
  date: string;
  eventType: {
    nameOfEvent: string;
    translatedNameOfEvent?: string;
  };
  eventDesign: {
    eventDesign: string;
    translatedEventDesign?: string;
  };
  additions?: Addition[];
}

// Define the props for the BulkTable component
interface BulkTableProps {
  personalData?: PersonalData;
  eventDetails?: EventDetails;
}

const BulkTable: React.FC<BulkTableProps> = ({
  personalData,
  eventDetails,
}) => {
  const personalDataDefault = personalData || {
    fullName: "N/A",
    mobileNumber: "N/A",
    secondMobileNumber: "N/A",
    favoriteColors: ["#FFFFFF"],
    dressColor: ["#FFFFFF"],
    place: "N/A",
    notes: "N/A",
  };

  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const translations = useSelector((state: any) => state.language.translations);

  const eventDetailsDefault = eventDetails || {
    packageName: "N/A",
    packagePrice: 0,
    translatedPackageName: "N/A",
    status: "N/A",
    place: "N/A",
    city: "N/A",
    date: "N/A",
    eventType: {
      nameOfEvent: "N/A",
      translatedNameOfEvent: "N/A",
    },
    eventDesign: {
      eventDesign: "N/A",
      translatedEventDesign: "N/A",
    },
    additions: [],
  };

  const renderValue = (
    defaultValue: string,
    translatedValue: string | undefined
  ) => {
    return currentLocale === "ar" && translatedValue
      ? translatedValue
      : defaultValue;
  };

  // Combine personal data and event details into a single row
  const rowData = {
    ...personalDataDefault,
    packageName: eventDetailsDefault.packageName,
    packagePrice: eventDetailsDefault.packagePrice,
    status: eventDetailsDefault.status,
    location: personalDataDefault.place,
    place: eventDetailsDefault.place,
    city: eventDetailsDefault.city,
    date:
      eventDetailsDefault.date !== "N/A"
        ? moment(eventDetailsDefault.date).format("DD-MM-YYYY")
        : "N/A",
    eventType: renderValue(
      eventDetailsDefault.eventType.nameOfEvent,
      eventDetailsDefault.eventType.translatedNameOfEvent
    ),
    eventDesign: renderValue(
      eventDetailsDefault.eventDesign.eventDesign,
      eventDetailsDefault.eventDesign.translatedEventDesign
    ),
    additions: eventDetailsDefault.additions || [],
  };

  // Define headers for the first table
  const firstTableHeaders: { key: keyof typeof rowData; label: string }[] = [
    { key: "fullName", label: translations.full_name },
    { key: "mobileNumber", label: translations.mobile_number },
    { key: "secondMobileNumber", label: translations.second_mobile_number },
    { key: "eventType", label: translations.event_type },
    { key: "location", label: translations.location },
    { key: "date", label: translations.date },
    { key: "city", label: translations.city },
    { key: "place", label: translations.place },
    { key: "favoriteColors", label: translations.booking.favoriteColor },
    { key: "dressColor", label: translations.booking.dressColor },
  ];

  // Define headers for the second table
  const secondTableHeaders: { key: keyof typeof rowData; label: string }[] = [
    { key: "eventDesign", label: translations.event_design },
    { key: "packagePrice", label: translations.package_price },
    { key: "packageName", label: translations.package_name },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* First Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-[#EFE7DF] text-primary bg-secondary text-left text-sm font-light">
          <tbody>
            {firstTableHeaders.map(({ key, label }, index) => (
              <tr key={index} className="border-b border-[#EFE7DF]">
                <th className="border-r border-[#EFE7DF] px-2 py-2 font-extrabold sm:px-4 sm:py-3">
                  {label}
                </th>
                <td className="px-2 py-2 font-medium text-primary sm:px-4 sm:py-3">
                  {key === "favoriteColors" || key === "dressColor" ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {rowData[key].map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="flex items-center gap-1"
                        >
                          <div
                            className="w-4 h-4 border sm:w-6 sm:h-6"
                            style={{ backgroundColor: color }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm">
                      {typeof rowData[key] === "string" ||
                      typeof rowData[key] === "number"
                        ? rowData[key]
                        : JSON.stringify(rowData[key])}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Second Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-[#EFE7DF] text-primary bg-secondary text-left text-sm font-light">
          <tbody>
            {secondTableHeaders.map(({ key, label }, index) => (
              <tr key={index} className="border-b border-[#EFE7DF]">
                <th className="border-r border-[#EFE7DF] px-2 py-2 font-extrabold sm:px-4 sm:py-3">
                  {label}
                </th>
                <td className="px-2 py-2 font-medium text-primary sm:px-4 sm:py-3">
                  {key === "status" ? (
                    <span
                      className={`text-xs sm:text-sm px-3 py-1 rounded-full border ${
                        rowData[key] === "completed"
                          ? "bg-green-500 text-white"
                          : rowData[key] === "rejected"
                          ? "bg-red-500 text-white"
                          : rowData[key] === "underReview"
                          ? "bg-yellow-500 text-black animate-zoom"
                          : ""
                      }`}
                    >
                      {rowData[key]}
                    </span>
                  ) : key === "packagePrice" ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm">{rowData[key]}</span>
                      <Image
                        src="/images/SR.png"
                        alt="SR"
                        width={20}
                        height={20}
                        className={currentLocale === "ar" ? "scale-x-[-1]" : ""}
                      />
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm">
                      {typeof rowData[key] === "string" ||
                      typeof rowData[key] === "number"
                        ? rowData[key]
                        : JSON.stringify(rowData[key])}
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {/* Additions Row */}
            <tr className="border-b border-[#EFE7DF]">
              <th className="border-r border-[#EFE7DF] px-2 py-2 font-extrabold sm:px-4 sm:py-3">
                {translations.additions || "Additions"}
              </th>
              <td className="px-2 py-2 font-medium text-primary sm:px-4 sm:py-3">
                {rowData.additions.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-1">
                    {rowData.additions.map((addition, idx) => (
                      <li key={idx} className="text-xs sm:text-sm">
                        {renderValue(
                          addition.typeOfAddition,
                          addition.translatedTypeOfAddition
                        )}{" "}
                        (Qty: {addition.quantity})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs sm:text-sm">N/A</span>
                )}
              </td>
            </tr>

            {/* Notes Row */}
            <tr className="border-b border-[#EFE7DF]">
              <th className="border-r border-[#EFE7DF] px-2 py-2 font-extrabold sm:px-4 sm:py-3">
                {translations.notes || "Notes"}
              </th>
              <td className="px-2 py-2 font-medium text-primary sm:px-4 sm:py-3">
                <span className="text-xs sm:text-sm">
                  {rowData.notes || "N/A"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BulkTable;
