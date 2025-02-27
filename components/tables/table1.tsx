import React from "react";
import moment from "moment";

// Define the type for personal data and additional fields
interface PersonalData {
  fullName: string;
  mobileNumber: string;
  secondMobileNumber: string;
  favoriteColors: string;
  notes: string;
}

interface EventDetails {
  packageName: string;
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
    favoriteColors: "#FFFFFF",
    notes: "N/A",
  };

  const eventDetailsDefault = eventDetails || {
    packageName: "N/A",
    place: "N/A",
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
    place: eventDetailsDefault.place,
    city: eventDetailsDefault.city,
    date:
      eventDetailsDefault.date !== "N/A"
        ? moment(eventDetailsDefault.date).format("DD-MM-YYYY")
        : "N/A",
    eventType: eventDetailsDefault.eventType.nameOfEvent,
    eventDesign: eventDetailsDefault.eventDesign.eventDesign,
  };

  // Define headers for the table
  const headers: { key: keyof typeof rowData; label: string }[] = [
    { key: "packageName", label: "PackageName" },
    { key: "fullName", label: "Full Name" },
    { key: "mobileNumber", label: "Mobile Number" },
    { key: "secondMobileNumber", label: "Second Mobile Number" },
    { key: "favoriteColors", label: "Favorite Colors" },
    { key: "place", label: "Place" },
    { key: "city", label: "City" },
    { key: "date", label: "Date" },
    { key: "eventType", label: "Event Type" },
    { key: "eventDesign", label: "Event Design" },
  ];

  // Split data into two halves for two columns
  const half = Math.ceil(headers.length / 2);
  const firstColumn = headers.slice(0, half);
  const secondColumn = headers.slice(half);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 ">
      {/* First Column */}
      <table className="w-full border-collapse border-2 border-[#EFE7DF] text-primary bg-secondary text-left text-sm font-light">
        <tbody>
          {firstColumn.map(({ key, label }, index) => (
            <tr key={index} className="border-b border-[#EFE7DF]">
              <th className="border-r border-[#EFE7DF] px-4 py-3 font-extrabold md:px-6 md:py-4">
                {label}
              </th>
              <td className="px-4 py-2 font-medium text-primary md:px-6 md:py-4">
                {key === "favoriteColors" ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 border"
                      style={{ backgroundColor: rowData[key] }}
                    ></div>
                    <span>{rowData[key]}</span>
                  </div>
                ) : (
                  rowData[key]
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Second Column */}
      <table className="w-full border-collapse border-2 border-[#EFE7DF] text-primary bg-secondary text-left text-sm font-light">
        <tbody>
          {secondColumn.map(({ key, label }, index) => (
            <tr key={index} className="border-b border-[#EFE7DF]">
              <th className="border-r border-[#EFE7DF] px-4 py-3 font-extrabold md:px-6 md:py-4">
                {label}
              </th>
              <td className="px-4 py-2 font-medium text-primary md:px-6 md:py-4">
                {key === "favoriteColors" ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 border"
                      style={{ backgroundColor: rowData[key] }}
                    ></div>
                    <span>{rowData[key]}</span>
                  </div>
                ) : (
                  rowData[key]
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BulkTable;
