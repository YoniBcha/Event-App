/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useGetSelfBookedEventsQuery } from "@/store/endpoints/apiSlice";
import Image from "next/image";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Dropdown } from "primereact/dropdown";
import { FaSortAmountDown, FaFilter } from "react-icons/fa";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Choose a theme
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
      };
    };
  };
}

const BookedEvents = () => {
  const [sortOption, setSortOption] = useState<string>("newest");
  const [filterOption, setFilterOption] = useState<string>(""); // Default filter is empty string for "All"

  const { data, isLoading, refetch } = useGetSelfBookedEventsQuery({
    status: filterOption === "all" ? "" : filterOption, // Pass empty string for "All"
    sort: sortOption === "newest" ? undefined : "oldest",
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
    refetch();
  };

  const handleFilterChange = (e: { value: string }) => {
    setFilterOption(e.value);
    refetch();
  };

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
            <div className="bg-primary w-40 p-1 max-md:h-fit text-lg text-white rounded-lg text-center md:py-2 md:rounded-xl md:text-lg">
              {event.orderStatus}
            </div>
            <div className="bg-[#dedede] p-1 max-md:h-fit text-lg text-white rounded-lg hover:text-primary cursor-pointer text-center md:py-2 md:rounded-xl md:text-lg">
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
    </div>
  );
};

export default BookedEvents;
