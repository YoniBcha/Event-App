/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import moment from "moment";
import Image from "next/image"; // Import the Image component
import { useSelector } from "react-redux";

// Define the type for personal data and additional fields
interface PersonalData {
  fullName: string;
  mobileNumber: string;
  secondMobileNumber: string;
  favoriteColors: string[]; // Updated to an array of strings
  dressColor: string[];
  notes: string;
  place: string; // Added place to PersonalData
}

interface EventDetails {
  packageName: string;
  packagePrice: number;
  status: string;
  place: string;
  city: string;
  date: string;
  eventType: {
    nameOfEvent: string;
  };
  eventDesign: {
    eventDesign: string;
  };
}

// Define the props for the BulkTable component
interface BulkTableProps {
  personalData?: PersonalData; // Make personalData optional
  eventDetails?: EventDetails; // Add eventDetails as an optional prop
}

const BulkTable: React.FC<BulkTableProps> = ({
  personalData,
  eventDetails,
}) => {
  // Provide default values if personalData or eventDetails is undefined
  const personalDataDefault = personalData || {
    fullName: "N/A",
    mobileNumber: "N/A",
    secondMobileNumber: "N/A",
    favoriteColors: ["#FFFFFF"], // Default to an array with a single color
    dressColor: ["#FFFFFF"],
    place: "N/A", // Default place for personalData
    notes: "N/A",
  };
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const eventDetailsDefault = eventDetails || {
    packageName: "N/A",
    packagePrice: 0,
    status: "N/A",
    place: "N/A", // Default place for eventDetails
    city: "N/A",
    date: "N/A",
    eventType: {
      nameOfEvent: "N/A",
    },
    eventDesign: {
      eventDesign: "N/A",
    },
  };

  // Combine personal data and event details into a single row
  const rowData = {
    ...personalDataDefault,
    packageName: eventDetailsDefault.packageName,
    packagePrice: eventDetailsDefault.packagePrice,
    status: eventDetailsDefault.status,
    location: personalDataDefault.place, // First place (from personalData)
    place: eventDetailsDefault.place, // Second place (from eventDetails)
    city: eventDetailsDefault.city,
    date:
      eventDetailsDefault.date !== "N/A"
        ? moment(eventDetailsDefault.date).format("DD-MM-YYYY")
        : "N/A",
    eventType: eventDetailsDefault.eventType.nameOfEvent,
    eventDesign: eventDetailsDefault.eventDesign.eventDesign,
  };

  // Define headers for the first table (up to "Location")
  const firstTableHeaders: { key: keyof typeof rowData; label: string }[] = [
    { key: "fullName", label: "Full Name" },
    { key: "mobileNumber", label: "Mobile Number" },
    { key: "secondMobileNumber", label: "Second Mobile Number" },
    { key: "eventType", label: "Event Type" },
    { key: "location", label: "Location" }, // First place (from personalData)
    { key: "date", label: "Date" },
    { key: "city", label: "City" },
    { key: "place", label: "Place" }, // Second place (from eventDetails)
    { key: "favoriteColors", label: "Favorite Colors" },
    { key: "dressColor", label: "Dress Color" },
  ];

  // Define headers for the second table (remaining fields)
  const secondTableHeaders: { key: keyof typeof rowData; label: string }[] = [
    { key: "eventDesign", label: "Event Design" },
    { key: "packagePrice", label: "Package Price" },
    { key: "packageName", label: "Package Name" },
  ];

  // Get the current locale (assuming it's stored in a context or state)
  // Replace with your actual locale logic

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
                          <span className="text-xs sm:text-sm">{color}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm">{rowData[key]}</span>
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
                          : rowData[key] === "pending"
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
                    <span className="text-xs sm:text-sm">{rowData[key]}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BulkTable;
