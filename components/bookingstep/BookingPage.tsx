"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { FaCalendarAlt, FaCity, FaMapMarkerAlt } from "react-icons/fa";

const validationSchema = yup.object({
  city: yup.string().required("City is required"),
  place: yup.string().required("Place is required"),
  date: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Date is required"),
});

const saudiCities = [
  "Jeddah",
  "Makkah",
  "Riyadh"
];

interface FormData {
  city: string;
  place: string;
  date: Date | null;
}

interface BookingPageProps {
  setBookingPageData: (data: FormData) => void;
}

const BookingPage = ({ setBookingPageData }: BookingPageProps) => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [showPlaceDropdown, setShowPlaceDropdown] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const sortedCities = saudiCities.sort((a, b) => a.localeCompare(b));
  const filteredCities = sortedCities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  interface RootState {
    language: {
      translations: {
        booking: {
          selectPlace: string;
          selectDate: string;
          selectCity: string;
          searchCity: string;
          bookBtn: string;
        };
      };
    };
  }

  const translations = useSelector(
    (state: RootState) => state.language.translations
  );
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema) as Resolver<FormData>,
  });

  const handleDateChange = (date: Date | null) => {
    if (date && date <= new Date()) {
      return; // Prevent selecting past dates
    }
    setSelectedDate(date);
    setValue("date", date);
    setIsModalOpen(false);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setValue("city", city);
    setShowCityDropdown(false);
  };

  const handlePlaceChange = (place: string) => {
    if (selectedPlace === place) {
      setSelectedPlace(null); // Unselect if clicked twice
      setValue("place", "");
    } else {
      setSelectedPlace(place);
      setValue("place", place);
    }
    setShowPlaceDropdown(false);
  };

  const onSubmit = (data: FormData) => {
    const payload = { ...data };
    console.log("Form data is:", payload);
    setBookingPageData(payload);
  };

  // Framer Motion Variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <main className="">
      <form onSubmit={handleSubmit(onSubmit)} className="h-full">
        <section className="flex flex-col md:flex-row w-full h-[80vh] gap-5 px-5">
          <div className="flex justify-center items-center md:justify-end h-full w-full">
            <div className="flex flex-col justify-center items-center h-[80%] w-full lg:w-[60%] gap-5 rounded-2xl relative">
              <Image
                src={"/images/booking-image.jpg"}
                alt="About Image"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
          </div>
          <div className="flex justify-center items-center md:justify-start h-full w-full">
            <div className="flex flex-col justify-center items-center h-full md:h-[80%] w-full lg:w-[60%] gap-5 rounded-2xl shadow-xl">
              <div className="flex flex-col gap-5 relative w-[80%]">
                {/* Place Dropdown */}
                <div className="">
                  <div
                    onClick={() => setShowPlaceDropdown(!showPlaceDropdown)}
                    className="flex justify-between items-center rounded-xl border-2 bg-secondary px-3 py-2 w-full cursor-pointer"
                  >
                    <div>
                      <FaMapMarkerAlt className="text-2xl text-primary" />
                    </div>
                    <div className="">
                      <div className="text-[#a1948d]">
                        {translations.booking.selectPlace}
                      </div>
                      <div className="text-[#a1948d] font-semibold">
                        {selectedPlace || ""}
                      </div>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <rect width="24" height="24" fill="none" />
                        <path
                          fill="none"
                          stroke="#281d1b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m7 10l5 5m0 0l5-5"
                        />
                      </svg>
                    </div>
                  </div>
                  <AnimatePresence>
                    {showPlaceDropdown && (
                      <motion.div
                        className="absolute top-10 mt-2 w-full bg-secondary  border border-[#d4c9c0] rounded-lg shadow-lg z-10"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        {["outdoor", "indoor", "both"].map((place) => (
                          <label
                            key={place}
                            className="flex items-center p-2 hover:bg-primary cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              name="place"
                              value={place}
                              checked={selectedPlace === place}
                              onChange={() => handlePlaceChange(place)}
                              className="mr-2 w-4 h-4 border border-[#c2937b] rounded-sm appearance-none checked:bg-primary checked:border-[#685651]"
                            />
                            <span className="text-[#685651]">{place}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {errors.place && (
                    <p className="text-red-500">{errors.place.message}</p>
                  )}
                </div>

                {/* Date Picker */}
                <div className="">
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="flex justify-between items-center  rounded-xl border-2 bg-secondary px-3 py-2 w-full cursor-pointer"
                  >
                    <div>
                      <FaCalendarAlt className="text-2xl text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-[#a1948d]">
                        {translations.booking.selectDate}
                      </div>
                      <div className="text-[#a1948d] font-semibold">
                        {selectedDate ? selectedDate.toLocaleDateString() : ""}
                      </div>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <rect width="24" height="24" fill="none" />
                        <path
                          fill="none"
                          stroke="#281d1b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m7 10l5 5m0 0l5-5"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.date && (
                    <p className="text-red-500">{errors.date.message}</p>
                  )}
                </div>

                {/* City Dropdown */}
                <div className="">
                  <div
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="flex justify-between items-center rounded-xl border-2 bg-secondary px-3 py-2 w-full cursor-pointer"
                  >
                    <div>
                      <FaCity className="text-2xl text-primary" />
                    </div>
                    <div>
                      <div className="text-[#a1948d]">
                        {translations.booking.selectCity}
                      </div>
                      <div className="text-[#a1948d] font-semibold">
                        {selectedCity || ""}
                      </div>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <rect width="24" height="24" fill="none" />
                        <path
                          fill="none"
                          stroke="#281d1b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m7 10l5 5m0 0l5-5"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.city && (
                    <p className="text-red-500">{errors.city.message}</p>
                  )}

                  <AnimatePresence>
                    {showCityDropdown && (
                      <motion.div
                        className="absolute top-full mt-2 w-full bg-secondary border border-[#d4c9c0] rounded-lg shadow-lg z-10 h-40 overflow-y-auto"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <div className="p-2 sticky top-0 backdrop-blur-md bg-secondary">
                          <input
                            type="text"
                            placeholder={translations.booking.searchCity}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2 py-1 border border-[#d4c9c0]  rounded-md focus:outline-none"
                          />
                        </div>
                        {filteredCities.map((city) => (
                          <label
                            key={city}
                            className="flex items-center p-2 hover:bg-primary cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              name="city"
                              value={city}
                              checked={selectedCity === city}
                              onChange={() => handleCityChange(city)}
                              className="mr-2 w-4 h-4 border border-[#c2937b] rounded-full appearance-none checked:bg-primary checked:border-[#685651]"
                            />
                            <span className="text-[#281d1b]">{city}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <motion.button
                  type="submit"
                  className="flex items-center justify-center bg-primary text-white hover:bg-secondary hover:border hover:text-primary rounded-full px-10 py-3"
                  variants={{
                    hover: {
                      scale: 1.05,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                      borderColor: "#a57a6a",
                      transition: { duration: 0.2, ease: "easeInOut" },
                    },
                    tap: {
                      scale: 0.95,
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                      transition: { duration: 0.1, ease: "easeInOut" },
                    },
                  }}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {translations.booking.bookBtn}
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </form>

      {/* Date Picker Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="backdrop-blur-lg bg-white/40 px-3 py-2 rounded-lg shadow-lg"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-primary">
                  {translations.booking.selectDate}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-primary hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <rect width="24" height="24" fill="none" />
                    <path
                      fill="#685651"
                      d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                      strokeWidth="0.5"
                      stroke="#685651"
                    />
                  </svg>
                </button>
              </div>
              <Controller
                name="date"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={handleDateChange}
                    inline
                    minDate={new Date()} // Prevent selecting past dates
                    className="w-full"
                    dayClassName={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); // Reset time part to ensure accurate comparison
                      date.setHours(0, 0, 0, 0); // Do the same for the date being checked

                      let className = "";

                      if (
                        field.value &&
                        field.value instanceof Date &&
                        date.toDateString() === field.value.toDateString()
                      ) {
                        className +=
                          "react-datepicker__day--selected bg-primary ";
                      }

                      if (date.toDateString() === today.toDateString()) {
                        className += "bg-today "; // Add this class for today's date
                      }

                      return className;
                    }}
                  />
                )}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default BookingPage;
