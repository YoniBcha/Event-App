"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

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
  "Riyadh",
  "Jeddah",
  "Mecca",
  "Medina",
  "Dammam",
  "Taif",
  "Tabuk",
  "Al Khobar",
  "Abha",
  "Najran",
  "Hail",
  "Jizan",
  "Al Bahah",
  "Arar",
  "Sakaka",
  "Buraidah",
  "Khamis Mushait",
  "Al Qunfudhah",
  "Yanbu",
  "Al Jubail",
  "Dhahran",
  "Al Hofuf",
  "Ras Tanura",
  "Al Kharj",
  "Al Qatif",
  "Al Mubarraz",
  "Al Wajh",
  "Qurayyat",
  "Unaizah",
  "Al Majma'ah",
  "Al Zulfi",
  "Al Bukayriyah",
  "Al Namas",
  "Al Ula",
  "Al Bad'",
  "Al Jawf",
  "Al Qaisumah",
  "Al Artawiyah",
  "Al Qarah",
  "Al Khafji",
  "Al Mithnab",
  "Al Sulayyil",
  "Al Duwadimi",
  "Al Lith",
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
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema) as Resolver<FormData>, // Explicitly cast the resolver
  });

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setValue("date", date);
    setIsModalOpen(false);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city); // Set the selected city
    setValue("city", city); // Update the form value
    setShowCityDropdown(false); // Close the dropdown
  };

  const onSubmit = (data: FormData) => {
    const payload = { ...data };
    console.log("Form data is:", payload);
    setBookingPageData(payload);
  };

  return (
    <main className="">
      <form onSubmit={handleSubmit(onSubmit)} className="h-full">
        <section className="flex flex-col md:flex-row w-full h-[80vh] gap-5 px-5">
          <div className="flex justify-center items-center md:justify-end h-full w-full">
            <div className="flex flex-col justify-center items-center h-full md:h-[80%] w-full lg:w-[60%] gap-5 rounded-2xl shadow-xl">
              <div className="flex flex-col gap-5 relative w-[80%]">
                <div className="">
                  <div
                    onClick={() => setShowPlaceDropdown(!showPlaceDropdown)}
                    className="flex justify-between items-center border border-[#ebddd5] rounded-xl bg-[#fdfdfb] px-3 py-2 w-full cursor-pointer"
                  >
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 1024 1024"
                      >
                        <rect width="1024" height="1024" fill="none" />
                        <path
                          fill="#685651"
                          d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416M512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544"
                          strokeWidth="25.5"
                          stroke="#685651"
                        />
                        <path
                          fill="#685651"
                          d="M512 512a96 96 0 1 0 0-192a96 96 0 0 0 0 192m0 64a160 160 0 1 1 0-320a160 160 0 0 1 0 320"
                          strokeWidth="25.5"
                          stroke="#685651"
                        />
                      </svg>
                    </div>
                    <div className="">
                      <div className="text-[#a1948d]">Select Place: </div>
                      <div className="text-[#a1948d] font-semibold">
                        {selectedPlace ? selectedPlace : ""}
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
                  {showPlaceDropdown && (
                    <div className="absolute top-10 mt-2 w-full bg-[#eee7de] border border-[#d4c9c0] rounded-lg shadow-lg z-10">
                      {["outdoor", "indoor", "both"].map((place) => (
                        <label
                          key={place}
                          className="flex items-center p-2 hover:bg-[#c2937b] cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="place"
                            value={place}
                            checked={selectedPlace === place}
                            onChange={() => {
                              setSelectedPlace(place);
                              setShowPlaceDropdown(false);
                              setValue("place", place);
                            }}
                            className="mr-2 w-4 h-4 hover:border-white border border-[#c2937b] rounded-sm appearance-none checked:bg-[#685651] checked:border-[#685651]"
                          />
                          <span className="text-[#685651]">{place}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {errors.place && (
                    <p className="text-red-500">{errors.place.message}</p>
                  )}
                </div>

                <div className="">
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="flex justify-between items-center border border-[#ebddd5] rounded-xl bg-[#fdfdfb] px-3 py-2 w-full cursor-pointer"
                  >
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <rect width="24" height="24" fill="none" />
                        <path
                          fill="#685651"
                          d="M19.5 4h-3V2.5a.5.5 0 0 0-1 0V4h-7V2.5a.5.5 0 0 0-1 0V4h-3A2.503 2.503 0 0 0 2 6.5v13A2.503 2.503 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 19.5 4M21 19.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5V11h18zm0-9.5H3V6.5C3 5.672 3.67 5 4.5 5h3v1.5a.5.5 0 0 0 1 0V5h7v1.5a.5.5 0 0 0 1 0V5h3A1.5 1.5 0 0 1 21 6.5z"
                          strokeWidth="0.5"
                          stroke="#685651"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-[#a1948d]">Select Date</div>
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

                <div className="">
                  <div
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="flex justify-between items-center border border-[#ebddd5] rounded-xl bg-[#fdfdfb] px-3 py-2 w-full cursor-pointer"
                  >
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 1024 1024"
                      >
                        <rect width="1024" height="1024" fill="none" />
                        <path
                          fill="#685651"
                          d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416M512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544"
                          strokeWidth="25.5"
                          stroke="#685651"
                        />
                        <path
                          fill="#685651"
                          d="M512 512a96 96 0 1 0 0-192a96 96 0 0 0 0 192m0 64a160 160 0 1 1 0-320a160 160 0 0 1 0 320"
                          strokeWidth="25.5"
                          stroke="#685651"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[#a1948d]">Select City: </div>
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

                  {showCityDropdown && (
                    <div className="absolute top-full mt-2 w-full bg-[#eee7de] border border-[#d4c9c0] rounded-lg shadow-lg z-10 h-40 overflow-y-auto">
                      <div className="p-2 sticky top-0 bg-[#eee7de]">
                        <input
                          type="text"
                          placeholder="Search cities..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full px-2 py-1 border border-[#d4c9c0] hover:border-white rounded-md focus:outline-none"
                        />
                      </div>
                      {filteredCities.map((city) => (
                        <label
                          key={city}
                          className="flex items-center p-2 hover:bg-[#c2937b] cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="city"
                            value={city}
                            checked={selectedCity === city}
                            onChange={() => handleCityChange(city)}
                            className="mr-2 w-4 h-4 border border-[#c2937b] rounded-full appearance-none checked:bg-[#685651] checked:border-[#685651] hover:border-white"
                          />
                          <span className="text-[#281d1b]">{city}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="flex items-center justify-center bg-primary rounded-full px-10 py-3"
                >
                  <div className="text-white">Book Now</div>
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center md:justify-start h-full w-full">
            <div className="flex flex-col justify-center items-center h-[80%] w-full lg:w-[60%] gap-5 rounded-2xl relative">
              <Image
                src={"/zip/Rectangle.png"}
                alt="About Image"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
          </div>
        </section>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white px-3 py-2 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-primary">
                Select a Date
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
                  className="w-full"
                  dayClassName={(date) => {
                    return field.value &&
                      field.value instanceof Date &&
                      date.toDateString() === field.value.toDateString()
                      ? "react-datepicker__day--selected"
                      : "";
                  }}
                />
              )}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default BookingPage;
