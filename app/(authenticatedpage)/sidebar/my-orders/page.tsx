/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useGetSelfBookedEventsQuery } from "@/store/endpoints/apiSlice";
import Image from "next/image";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Dropdown } from "primereact/dropdown";
import PaymentModal from "@/components/payInfo";
import {
  FaSortAmountDown,
  FaFilter,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
// import "primereact/resources/themes/lara-light-indigo/theme.css"; // Choose a theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons

// Define interfaces for the data structures
interface Event {
  _id: string;
  personalData: {
    fullName: string;
    mobileNumber: string;
    secondMobileNumber?: string;
    favoriteColors: string;
    notes?: string;
  };
  city: string;
  date: string;
  eventType: {
    nameOfEvent: string;
    image: string;
  };
  eventDesign: {
    eventDesign: string;
  };
  eventPackage: {
    packageName: string;
  };
  orderStatus: string;
  eventPackageAdditions: {
    _id: string;
    additionId: {
      additionName: string;
    };
    additionTypeName: string;
    quantity: number;
  }[];
  extraServices: {
    _id: string;
    packageName: string;
  }[];
}

interface ApiResponse {
  bookedEvents: Event[];
  total: number; // Total number of events
  status: boolean;
  message: string;
}

interface RootState {
  language: {
    translations: {
      booking: {
        myReservation: string;
        event: string;
        package: string;
        eventDesign: string;
        city: string;
        quotation: string;
        date: string;
        pay: string;
      };
    };
  };
}

const BookedEvents = () => {
  const [sortOption, setSortOption] = useState<string>("newest");
  const [filterOption, setFilterOption] = useState<string>(""); // Default filter is empty string for "All"
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [pageSize] = useState(5); // Number of items per page
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );
  const { data, isLoading, refetch } = useGetSelfBookedEventsQuery({
    status: filterOption === "all" ? "" : filterOption, // Pass empty string for "All"
    sort: sortOption === "newest" ? undefined : "oldest",
    page: currentPage, // Pass current page to the API
    size: pageSize, // Pass page size to the API
  });

  const translations = useSelector(
    (state: RootState) => state.language.translations
  );

  const sortOptions = [
    { label: "Newest", value: "newest", icon: <FaSortAmountDown /> },
    { label: "Oldest", value: "oldest", icon: <FaSortAmountDown /> },
  ];

  const filterOptions = [
    { label: "All", value: "all", icon: <FaFilter /> }, // Empty string for "All"
    { label: "Pending", value: "pending", icon: <FaFilter /> },
    { label: "Completed", value: "completed", icon: <FaFilter /> },
    { label: "Rejected", value: "rejected", icon: <FaFilter /> },
  ];

  const handleSortChange = (e: { value: string }) => {
    setSortOption(e.value);
    setCurrentPage(1); // Reset to the first page when sorting changes
    refetch();
  };

  const handleFilterChange = (e: { value: string }) => {
    setFilterOption(e.value);
    setCurrentPage(1); // Reset to the first page when filtering changes
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };
  const handlePaymentClick = () => {
    setIsPaymentModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false); // Close the modal
  };

  // const handlePageSizeChange = (size: number) => {
  //   setPageSize(size);
  //   setCurrentPage(1); // Reset to the first page when page size changes
  //   refetch();
  // };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const response = data as ApiResponse;

  // If no booked events are found
  if (!response?.bookedEvents || response.bookedEvents.length === 0) {
    return (
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-5 text-primary">
          {translations.booking.myReservation}
        </h1>
        <div className="flex gap-4 mb-5">
          <Dropdown
            value={sortOption}
            options={sortOptions}
            onChange={handleSortChange}
            optionLabel="label"
            placeholder="Sort By"
            className="w-36 p-dropdown-sm hover:bg-secondary" // Decreased width to 36 (w-36)
            itemTemplate={(option) => (
              <div className="flex items-center gap-2 w-full rounded-md">
                {option.icon}
                {option.label}
              </div>
            )}
          />
          <Dropdown
            value={filterOption}
            options={filterOptions}
            onChange={handleFilterChange}
            optionLabel="label"
            placeholder="Filter By"
            className="w-36 p-dropdown-sm hover:bg-secondary" // Decreased width to 36 (w-36)
            itemTemplate={(option) => (
              <div className="flex items-center gap-2 w-full rounded-md">
                {option.icon}
                {option.label}
              </div>
            )}
          />
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-500">No orders found.</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(response.total / pageSize); // Calculate total pages

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-5 text-primary">
        {translations.booking.myReservation}
      </h1>
      <div className="flex gap-4 mb-5">
        <Dropdown
          value={sortOption}
          options={sortOptions}
          onChange={handleSortChange}
          optionLabel="label"
          placeholder="Sort By"
          className="w-36 p-dropdown-sm hover:bg-secondary hover:border-primary" // Decreased width to 36 (w-36)
          itemTemplate={(option) => (
            <div className="flex items-center gap-2 w-full rounded-md">
              {option.icon}
              {option.label}
            </div>
          )}
        />
        <Dropdown
          value={filterOption}
          options={filterOptions}
          onChange={handleFilterChange}
          optionLabel="label"
          placeholder="Filter By"
          className="w-36 p-dropdown-sm hover:bg-secondary" // Decreased width to 36 (w-36)
          itemTemplate={(option) => (
            <div className="flex items-center gap-2 w-full rounded-md">
              {option.icon}
              {option.label}
            </div>
          )}
        />
      </div>
      {response?.bookedEvents.map((event: Event) => (
        <div
          key={event._id}
          className="flex flex-col md:flex-row w-full lg:w-[80%] gap-10 max-md:gap-2 mb-6 p-3 border rounded-2xl shadow-lg bg-white"
        >
          <div className="flex flex-row gap-2">
            <div>
              <Image
                src={event.eventType.image}
                alt="Event"
                width={600}
                height={400}
                className="w-[14rem] h-[12rem] object-cover rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl max-md:text-xl text-primary">
                {event.eventType.nameOfEvent} {translations.booking.event}
              </div>
              <p className="text-sm text-tertiary">
                {translations.booking.package}: {event.eventPackage.packageName}
              </p>
              <p className="font-medium text-primary text-sm">
                {translations.booking.eventDesign}:{" "}
                {event.eventDesign.eventDesign}
              </p>
              <p className="text-tertiary text-sm">
                {event.personalData.mobileNumber}
              </p>
              {event.personalData.secondMobileNumber && (
                <p className="text-tertiary text-sm">
                  {event.personalData.secondMobileNumber}
                </p>
              )}
              <div className="flex">
                <p className="text-gray-400">{translations.booking.city}:</p>
                <p className="text-primary pl-2">{event.city}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap md:flex-col gap-3 border-l-4 max-md:border-none border-primary md:pl-5 pl-1">
            <div className="bg-primary w-40 p-1 max-md:h-fit max-sm:text-sm text-lg text-white rounded-lg text-center md:py-2 md:rounded-xl md:text-lg">
              {event.orderStatus}
            </div>
            {event.orderStatus === "completed" && (
              <button
                className="bg-green-500 w-40 p-1 max-md:h-fit max-sm:text-sm text-lg text-white rounded-lg hover:bg-green-600 text-center md:py-2 md:rounded-xl md:text-lg"
                onClick={handlePaymentClick}
              >
                {translations.booking.pay}
              </button>
            )}
            <div className="bg-[#dedede] p-1 max-md:h-fit text-lg max-sm:text-sm text-white rounded-lg hover:text-primary cursor-pointer text-center md:py-2 md:rounded-xl md:text-lg">
              <Link
                href={{
                  pathname: "/sidebar/quotation",
                  query: { id: event._id },
                }}
              >
                {translations.booking.quotation}
              </Link>
            </div>

            <div className="mt-5 max-md:mt-1 flex justify-start">
              <p className="text-primary font-semibold text-center">
                {translations.booking.date}:
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
      {/* Pagination Controls */}
      <div className="lg:flex-row flex-col flex w-full lg:w-[80%] justify-between items-center mt-8">
        <div className=" font-bold text-primary">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, response.total)} of {response.total}{" "}
          results
        </div>
        <div className="flex  items-center gap-2">
          <button
            className="p-2 flex items-center bg-primary text-white rounded-md disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {currentLocale === "ar" ? (
              <FaChevronRight className="inline-block" /> // Flip icon for RTL
            ) : (
              <FaChevronLeft className="inline-block" /> // Default icon for LTR
            )}
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === index + 1
                    ? "bg-primary text-white" // Active page
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300" // Inactive page
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="p-2 bg-primary flex items-center text-white rounded-md disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {currentLocale === "ar" ? (
              <FaChevronLeft className="inline-block" /> // Flip icon for RTL
            ) : (
              <FaChevronRight className="inline-block" /> // Default icon for LTR
            )}
          </button>
        </div>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleCloseModal}
        name="Sample Name"
        accountNumber="1904637294923"
      />
    </div>
  );
};

export default BookedEvents;
