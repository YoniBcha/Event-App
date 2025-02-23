"use client";

import React from "react";
import { useGetSelfBookedEventsQuery } from "@/store/endpoints/apiSlice";
import Image from "next/image";

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

const BookedEvents = () => {
  const { data, isLoading } = useGetSelfBookedEventsQuery({});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const response = data as ApiResponse;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-5 text-primary">My Reservation</h1>
      {response?.bookedEvents.map((event: Event) => (
        <div
          key={event._id}
          className="flex flex-col md:flex-row  w-full lg:w-[80%] gap-10 max-md:gap-2 mb-6 p-3 border rounded-2xl shadow-lg bg-white"
        >
          <div className="flex flex-row gap-2 ">
            <div >
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
                {event.eventType.nameOfEvent} Event
              </div>
              <p className="text-sm text-tertiary">
                Package: {event.eventPackage.packageName}
              </p>
              <p className="font-medium text-primary text-sm">
                Event Design: {event.eventDesign.eventDesign}
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
                <p className="text-gray-400">City:</p>
                <p className="text-primary pl-2">{event.city}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap md:flex-col gap-3 border-l-4 max-md:border-none border-primary md:pl-5 pl-1 ">
            <div className="bg-primary w-40 p-1 max-md:h-fit text-lg text-white rounded-lg text-center md:py-2 md:rounded-xl md:text-2xl font-semibold">
              {event.orderStatus}
            </div>
            <div className="bg-[#dedede] p-1 max-md:h-fit text-lg text-white rounded-lg hover:text-primary cursor-pointer text-center md:py-2 md:rounded-xl md:text-2xl font-semibold">
              Quotation
            </div>

            <div className="mt-5 max-md:mt-1 flex justify-start">
              <p className="text-primary text-lg font-semibold text-end">
                Date:{new Date(event.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default BookedEvents;
