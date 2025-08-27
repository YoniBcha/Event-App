/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { Wheel } from "@uiw/react-color";
import { ChromePicker, ColorResult } from "react-color";
import { motion } from "framer-motion";
import { FaPlus, FaTrash } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";
import { Dropdown } from "primereact/dropdown";
import DatePicker from "react-datepicker";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const predefinedColors = [
  // Row 1
  "#FF0000",
  "#FF4000",
  "#FF8000",
  "#FFBF00",
  "#FFFF00",
  "#BFFF00",
  "#80FF00",
  "#40FF00",
  "#00FF00",
  "#00FF40",
  // Row 2
  "#00FF80",
  "#00FFBF",
  "#00FFFF",
  "#00BFFF",
  "#0080FF",
  "#0040FF",
  "#0000FF",
  "#4000FF",
  "#8000FF",
  "#BF00FF",
  // Row 3
  "#FF00FF",
  "#FF00BF",
  "#FF0080",
  "#FF0040",
  "#FF0000",
  "#FFFFFF",
  "#CCCCCC",
  "#999999",
  "#666666",
  "#000000",
];
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};
interface PersonalData {
  fullName: string;
  mobileNumber: string;
  secondMobileNumber: string;
  favoriteColors: string[];
  notes: string;
  noOfPeople: number;
  imageOfPlace: string[]; // Store URLs instead of File objects
  dressColor: string[];
  place: string;
  age?: string;
  length: number;
  birthDate?: number; // Optional field for birth date
  couponCode?: string;
}

interface PersonalDataProps {
  onSubmit: (personalData: PersonalData) => void;
}

export default function PersonalData({ onSubmit }: PersonalDataProps) {
  const [formData, setFormData] = useState<PersonalData>(() => {
    const savedData = sessionStorage.getItem("personalData");
    return savedData
      ? JSON.parse(savedData)
      : {
          fullName: "",
          mobileNumber: "",
          secondMobileNumber: "",
          favoriteColors: [],
          dressColor: [],
          notes: "",
          noOfPeople: 1,
          place: "",
          age: "",
          birthDate: 0,
          imageOfPlace: [], // Initialize as empty array for URLs
          couponCode: "",
        };
  });
  const [couponStatus, setCouponStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showFavoriteColorPicker, setShowFavoriteColorPicker] = useState(false);
  const [showDressColorPicker, setShowDressColorPicker] = useState(false);
  const [selectedFavoriteColor, setSelectedFavoriteColor] = useState("#ffffff");
  const [selectedDressColor, setSelectedDressColor] = useState("#ffffff");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const translations = useSelector((state: any) => state.language.translations);
  const isOtherSelected = !["Palace", "Hall", "Private"].includes(
    formData.place
  );
  const placeOptions = [
    { label: translations.palace, value: "Palace" },
    { label: translations.hall, value: "Hall" },
    { label: translations.private, value: "Private" },
    { label: translations.other, value: "Other" },
  ];

  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required(`${translations.booking.fullNameRequire}`),
    mobileNumber: Yup.string()
      .required(`${translations.booking.mobileRequire}`)
      .matches(/^[0-9]{10}$/, `${translations.booking.mobileMust}`),
    secondMobileNumber: Yup.string()
      .required(`${translations.booking.secondMobileRequire}`)
      .matches(/^[0-9]{10}$/, `${translations.booking.secondMobileMust}`)
      .test(
        "not-same-as-mobile",
        `${translations.booking.secondMobileNotMatch}`,
        function (value) {
          return value !== this.parent.mobileNumber;
        }
      ),
    favoriteColors: Yup.array()
      .of(Yup.string())
      .min(1, `${translations.booking.colorRequire}`),
    dressColor: Yup.array()
      .of(Yup.string())
      .min(1, `${translations.booking.at_least_one_dress_color_is_required}`),
    notes: Yup.string().required(`${translations.booking.noteRequire}`),
    noOfPeople: Yup.number()
      .required(`${translations.booking.number_of_people_is_required}`)
      .min(2, `${translations.booking.at_least_2_people_are_required}`)
      .max(1000, `${translations.booking.number_of_people_cannot_exceed_1000}`),
    place: Yup.string().required(`${translations.booking.place_is_required}`),
    imageOfPlace: Yup.array().of(
      Yup.string().required(`${translations.booking.an_image_URL_is_required}`)
    ),

    age: Yup.string()
      .required(translations.booking.birth_date_is_required)
      .test(
        "is-valid-date",
        translations.booking.invalid_date_format,
        (value) => {
          if (!value) return false;
          const date = new Date(value);
          return !isNaN(date.getTime());
        }
      )
      .test(
        "is-adult",
        translations.booking.must_be_at_least_18_years_old,
        (value) => {
          if (!value) return false;
          const birthDate = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }
          return age >= 18 && age <= 100;
        }
      ),
  });

  useEffect(() => {
    const savedData = sessionStorage.getItem("personalData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);

        // Set preview images if imageOfPlace exists
        if (parsedData.imageOfPlace && parsedData.imageOfPlace.length > 0) {
          setPreviewImages(parsedData.imageOfPlace);
        }
      } catch (error) {
        console.error("Error parsing sessionStorage data:", error);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("personalData", JSON.stringify(formData));
  }, [formData]);
  const handleBirthDateChange = (date: Date | null) => {
    if (!date) {
      setFormData({
        ...formData,
        age: "",
        birthDate: 0,
      });
      return;
    }

    const dateString = date.toISOString().split("T")[0];
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < date.getDate())
    ) {
      age--;
    }

    setFormData({
      ...formData,
      age: dateString,
      birthDate: age,
    });

    if (errors.age || errors.birthDate) {
      setErrors((prev) => ({
        ...prev,
        age: "",
        birthDate: "",
      }));
    }
  };

  const handleFavoriteColorChange = (color: any) => {
    setSelectedFavoriteColor(color.hex);
  };

  const handleDressColorChange = (color: any) => {
    setSelectedDressColor(color.hex);
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const addColor = (field: "favoriteColors" | "dressColor", color: string) => {
    if (!formData[field].includes(color)) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: [...prevData[field], color],
      }));

      // Clear the error for the field when a color is added
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }

    // Hide the color picker
    if (field === "favoriteColors") {
      setShowFavoriteColorPicker(false);
    } else {
      setShowDressColorPicker(false);
    }
  };

  const removeColor = (
    field: "favoriteColors" | "dressColor",
    color: string
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((c) => c !== color),
    }));

    // Clear the error for the field if no colors are left
    if (formData[field].length === 1) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
  };

  const handleImageSelection = (files: FileList | null) => {
    if (files && files.length > 0) {
      const newImages = Array.from(files);
      setSelectedImages((prev) => [...prev, ...newImages]);

      const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);

    const updatedFormData = { ...formData, imageOfPlace: updatedImages };
    setFormData(updatedFormData);
    sessionStorage.setItem("personalData", JSON.stringify(updatedFormData));
  };

  const handleClearImages = () => {
    setSelectedImages([]);
    setPreviewImages([]);
    const updatedFormData = { ...formData, imageOfPlace: [] };
    setFormData(updatedFormData);
    sessionStorage.setItem("personalData", JSON.stringify(updatedFormData));
  };

  const uploadImages = async (files: File[]) => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("images", file);

      try {
        const response = await fetch(
          "https://fenzoappprod.onrender.com/api/v1/admin/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        if (response.ok && result.imageUrls?.[0]?.url) {
          uploadedUrls.push(result.imageUrls[0].url);
        } else {
          toast.error(result.message || "Image upload failed");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error occurred while uploading images");
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading

    try {
      // Step 1: Validate the entire form data before proceeding
      await validationSchema.validate(formData, { abortEarly: false });

      // Step 2: Prepare form data - only include coupon if valid
      const submissionData = {
        ...formData,
        // Only include coupon data if it exists and is valid
        ...(couponStatus === "valid" && formData.couponCode
          ? { couponCode: formData.couponCode }
          : { couponCode: undefined }), // Explicitly remove if not valid
      };

      // Step 3: Check if there are already uploaded images in session storage
      if (
        submissionData?.length > 0 &&
        submissionData.imageOfPlace.length > 0
      ) {
        await onSubmit(submissionData); // Submit the existing data
        return;
      }

      // Step 4: Upload images and get URLs (only if validation passes)
      const uploadedUrls = await uploadImages(selectedImages);

      if (
        uploadedUrls?.length === 0 &&
        submissionData?.imageOfPlace.length == 0
      ) {
        toast.error(`${translations.booking.no_images_were_uploaded}`);
        setLoading(false); // Stop loading on error
        return;
      }

      // Step 5: Update formData with uploaded image URLs
      const updatedFormData = {
        ...submissionData, // Use the submissionData that already has proper coupon handling
        imageOfPlace: [...submissionData.imageOfPlace, ...uploadedUrls],
      };

      // Step 6: Update the state with the new form data
      setFormData(updatedFormData);

      // Step 7: Submit the form data (only if all fields are valid)
      await onSubmit(updatedFormData); // Ensure onSubmit is awaited
      setErrors({});

      // Step 8: Clear selected images and previews after successful submission
      setSelectedImages([]);
      setPreviewImages([]);
    } catch (validationErrors) {
      const newErrors: Record<string, string> = {};
      if (validationErrors instanceof Yup.ValidationError) {
        // Map Yup validation errors to the errors state
        validationErrors.inner.forEach((error) => {
          newErrors[error.path as string] = error.message;
        });
      } else {
        // Handle other errors (e.g., network errors)
        toast.error("An error occurred while submitting the form");
        console.error("Submission error:", validationErrors);
      }
      setErrors(newErrors);
    } finally {
      setLoading(false); // Stop loading in all cases
    }
  };

  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;

    const today = new Date();
    const birthDateObj = new Date(birthDate);

    // If the birth date is invalid, return 0
    if (isNaN(birthDateObj.getTime())) return 0;

    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleCheckCoupon = async () => {
    if (!formData.couponCode) return;

    try {
      setCouponStatus("checking");
      const token = getCookie("token");

      const response = await fetch(
        `https://fenzoappprod.onrender.com/api/v1/event/checkCoupon/${formData.couponCode}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.status) {
        setCouponStatus("valid");
        // You might want to store the coupon details in your form state
        // form.setFieldsValue({ couponDetails: data });
      } else {
        setCouponStatus("invalid");
      }
    } catch (error) {
      console.error("Error checking coupon:", error);
      setCouponStatus("invalid");
    }
  };
  return (
    <motion.div
      className="flex items-center justify-center h-full max-[500px]:p-1 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="w-full max-w-4xl p-6 max-[500px]:p-3 rounded-lg border-2 border-secondary shadow-lg">
        <motion.div
          className="text-center text-primary font-bold text-2xl mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {translations.booking.personalData}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.fullName}
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`border outline-none ${
                errors.fullName ? "border-red-500" : "border-primary"
              } input-field`}
            />
            {errors.fullName && (
              <div className="text-red-500 text-sm mt-1">{errors.fullName}</div>
            )}
          </motion.div>

          {/* Mobile Number */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.mobileNumber}
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className={`border outline-none ${
                errors.mobileNumber ? "border-red-500" : "border-primary"
              } input-field`}
            />
            {errors.mobileNumber && (
              <div className="text-red-500 text-sm mt-1">
                {errors.mobileNumber}
              </div>
            )}
          </motion.div>

          {/* Second Mobile Number */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.secondMobileNumber}
            </label>
            <input
              type="tel"
              name="secondMobileNumber"
              value={formData.secondMobileNumber}
              onChange={handleInputChange}
              className={`border outline-none ${
                errors.secondMobileNumber ? "border-red-500" : "border-primary"
              } input-field`}
            />
            {errors.secondMobileNumber && (
              <div className="text-red-500 text-sm mt-1">
                {errors.secondMobileNumber}
              </div>
            )}
          </motion.div>
          {/* Birth Date (Optional) */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.birth_date} *
            </label>
            <DatePicker
              selected={formData.age ? new Date(formData.age) : null}
              onChange={handleBirthDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText={translations.select_birth_date}
              className={`w-full p-2 border rounded ${
                errors.age ? "border-red-500" : "border-primary"
              }`}
              maxDate={new Date()}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              dropdownMode="select"
            />
            {errors.age && (
              <div className="text-red-500 text-sm mt-1">{errors.age}</div>
            )}
            {formData.birthDate && formData.birthDate > 0 && (
              <div className="text-sm text-gray-500 mt-1">
                Age: {formData.birthDate} years
              </div>
            )}
          </motion.div>

          {/* Number of People Invited */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.number_of_People_Invited}
            </label>
            <input
              type="number"
              name="noOfPeople"
              value={formData.noOfPeople}
              onChange={handleInputChange}
              min={1}
              className={`border outline-none ${
                errors.noOfPeople ? "border-red-500" : "border-primary"
              } input-field appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />
            {errors.noOfPeople && (
              <div className="text-red-500 text-sm mt-1">
                {errors.noOfPeople}
              </div>
            )}
          </motion.div>

          {/* Place */}

          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.place}
            </label>

            {/* PrimeReact Dropdown for Place */}
            <Dropdown
              value={isOtherSelected ? "Other" : formData.place}
              options={placeOptions}
              onChange={(e) => {
                const selectedValue = e.value;
                if (selectedValue === "Other") {
                  // If "Other" is selected, clear the place value
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    place: "",
                  }));
                } else {
                  // Otherwise, update the place value
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    place: selectedValue,
                  }));
                }

                // Clear the error if the user selects a valid option
                if (errors.place) {
                  setErrors((prevErrors) => ({ ...prevErrors, place: "" }));
                }
              }}
              placeholder="Select an option"
              className={`w-full ${errors.place ? "p-invalid" : ""}`} // PrimeReact's invalid class for errors
            />

            {/* Conditional Input for "Other" */}
            {isOtherSelected && (
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={(e) => {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    place: e.target.value,
                  }));
                  if (errors.place) {
                    setErrors((prevErrors) => ({ ...prevErrors, place: "" }));
                  }
                }}
                placeholder={translations.enter_your_choice}
                className={`border outline-none mt-2 ${
                  errors.place ? "border-red-500" : "border-primary"
                } input-field`}
              />
            )}

            {/* Error Message */}
            {errors.place && (
              <div className="text-red-500 text-sm mt-1">{errors.place}</div>
            )}
          </motion.div>
          {/* Image Picker for Multiple Images */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.upload_Images}
            </label>

            {/* Drag-and-Drop Area */}
            <div className="w-full h-auto rounded border border-primary flex-col justify-start items-start inline-flex">
              <div className="self-stretch h-24 px-8 pt-8 pb-6 flex-col justify-start items-start flex">
                <div className="self-stretch text-primary   text-2xl font-semibold font-['Inter'] leading-9">
                  {translations.booking.select_images}
                </div>
              </div>
              <div className="self-stretch px-8 py-2 flex-col justify-start items-start gap-6 flex">
                <div className="self-stretch justify-start items-start gap-4 flex">
                  <div className="h-full rounded-lg border-2 border-dashed border-primary flex flex-1 flex-col justify-center items-center">
                    {previewImages.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-5">
                        {previewImages.map((img: string, index: number) => (
                          <div key={index} className="relative group">
                            <Image
                              src={img}
                              alt={`Preview ${index}`}
                              width={1000}
                              height={1000}
                              className="object-contain h-32 w-32 rounded-lg border-2 border-dashed"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -top-2 -right-3 bg-red-500 text-white text-sm p-1 rounded-full"
                              aria-label="Remove Image"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="rounded-md flex justify-center items-center cursor-pointer">
                          <label
                            htmlFor="imageInput"
                            className="text-lg leading-6 font-medium text-primary p-4 rounded cursor-pointer"
                          >
                            {translations.booking.browse}
                          </label>
                          <input
                            id="imageInput"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                              handleImageSelection(e.target.files)
                            }
                            className="hidden"
                          />
                        </div>
                        {/* <p className="text-gray-500"></p> */}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="self-stretch px-8 pt-6 pb-8 justify-end items-center gap-4 inline-flex">
                {/* Add this new button */}
                <div className="rounded-md justify-center items-center flex">
                  <div className="px-2 py-1.5 flex-col justify-center items-center gap-2 inline-flex">
                    <label
                      htmlFor="imageInput"
                      className="text-white bg-primary hover:bg-secondary dark:text-white cursor-pointer rounded-xl px-4 py-1.5 text-sm font-medium font-['Inter'] leading-normal tracking-tight"
                    >
                      {translations.booking.add_images}
                    </label>
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageSelection(e.target.files)}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Existing Clear Images button */}
                <div className="rounded-md justify-center items-center flex">
                  <div className="px-2 py-1.5 flex-col justify-center items-center gap-2 inline-flex">
                    <div
                      onClick={handleClearImages}
                      className="text-white bg-primary hover:bg-secondary dark:text-white cursor-pointer rounded-xl px-4 py-1.5 text-sm font-medium font-['Inter'] leading-normal tracking-tight"
                    >
                      {translations.booking.clear_Images}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {errors.imageOfPlace && (
              <div className="text-red-500 text-sm mt-1">
                {errors.imageOfPlace}
              </div>
            )}
          </motion.div>

          {/* Favorite Colors */}
          <motion.div
            className="flex flex-col mb-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.favorite_Colors}
            </label>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-3">
              {/* Wheel Color Picker */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <Wheel
                  color={selectedFavoriteColor}
                  onChange={handleFavoriteColorChange}
                  width={150}
                  height={150}
                />
              </div>

              {/* Predefined Colors Grid */}
              <div className="grid grid-cols-10 gap-2">
                {predefinedColors.map((color, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full cursor-pointer border border-gray-300 shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => addColor("favoriteColors", color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              {/* Selected Colors Preview */}
              <div className="flex flex-wrap gap-4 flex-1">
                {formData.favoriteColors.map((color, index) => (
                  <div
                    key={index}
                    className="md:w-6 w-4 h-4 md:h-6 rounded-full ring-2 ring-offset-1 cursor-pointer relative group flex-shrink-0 shadow-md"
                    style={{ backgroundColor: color }}
                    onClick={() => removeColor("favoriteColors", color)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 rounded-full">
                      <FaTrash className="text-white text-xs" />
                    </div>
                  </div>
                ))}
              </div>

              {/* + Button to Add Color */}
              <button
                onClick={() =>
                  addColor("favoriteColors", selectedFavoriteColor)
                }
                className="md:p-3 p-2  rounded-full bg-primary text-white hover:bg-secondary transition-colors duration-200 flex-shrink-0 shadow-md"
                title="Add current color"
              >
                <FaPlus />
              </button>
            </div>

            {errors.favoriteColors && (
              <div className="text-red-500 text-sm mt-1">
                {errors.favoriteColors}
              </div>
            )}
          </motion.div>

          <motion.div
            className="flex flex-col mb-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.dress_Colors}
            </label>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-3">
              {/* Wheel Color Picker */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <Wheel
                  color={selectedDressColor}
                  onChange={handleDressColorChange}
                  width={150}
                  height={150}
                />
              </div>

              {/* Predefined Colors Grid */}
              <div className="grid grid-cols-10 gap-2">
                {predefinedColors.map((color, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full cursor-pointer border border-gray-300 shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => addColor("dressColor", color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              {/* Selected Colors Preview */}
              <div className="flex flex-wrap gap-4 flex-1">
                {formData?.dressColor?.map((color, index) => (
                  <div
                    key={index}
                    className="md:w-6 w-4 h-4 md:h-6 rounded-full ring-2 ring-offset-1 cursor-pointer relative group flex-shrink-0 shadow-md"
                    style={{ backgroundColor: color }}
                    onClick={() => removeColor("dressColor", color)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 rounded-full">
                      <FaTrash className="text-white text-xs" />
                    </div>
                  </div>
                ))}
              </div>

              {/* + Button to Add Color */}
              <button
                onClick={() => addColor("dressColor", selectedDressColor)}
                className="md:p-3 p-2 rounded-full bg-primary text-white hover:bg-secondary transition-colors duration-200 flex-shrink-0 shadow-md"
                title="Add current color"
              >
                <FaPlus />
              </button>
            </div>

            {errors.dressColor && (
              <div className="text-red-500 text-sm mt-1">
                {errors.dressColor}
              </div>
            )}
          </motion.div>
        </div>
        <motion.div
          className="flex flex-col "
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <label className="font-medium text-tertiary text-md mb-2">
            {translations.couponCodeOptional}
          </label>
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <input
                type="text"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleInputChange}
                className={`w-full border outline-none rounded-lg px-4 py-2 ${
                  errors.couponCode
                    ? "border-red-500"
                    : couponStatus === "valid"
                    ? "border-green-500 bg-green-50"
                    : couponStatus === "invalid"
                    ? "border-red-500 bg-red-50"
                    : "border-primary"
                } transition-colors duration-300`}
                placeholder={translations.enterCoupon}
              />
              {couponStatus === "valid" && (
                <FaCheckCircle className="h-5 w-5 text-green-500 absolute right-3 top-2.5" />
              )}
              {couponStatus === "invalid" && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, couponCode: "" }))
                  }
                  className={`absolute ${
                    currentLocale == "ar" ? "left-3" : "right-3"
                  }  top-2.5 text-red-500 hover:text-red-700`}
                >
                  <FaTimesCircle className="h-5 w-5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleCheckCoupon}
              disabled={
                !formData?.couponCode?.trim() || couponStatus === "checking"
              }
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                !formData?.couponCode?.trim() || couponStatus === "checking"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark text-white"
              }`}
            >
              {couponStatus === "checking" ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {translations.checking}
                </span>
              ) : (
                translations.validate
              )}
            </button>
          </div>

          <div className="min-h-6 mt-1">
            {errors.couponCode && (
              <p className="text-red-500 text-sm">{errors.couponCode}</p>
            )}

            {couponStatus === "valid" && (
              <p className="text-green-600 text-sm flex items-center gap-1">
                <FaCheckCircle className="h-4 w-4" />
                {translations.couponApplied}
              </p>
            )}

            {couponStatus === "invalid" && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <FaTimesCircle className="h-4 w-4" />
                {translations.invalidCoupon}
              </p>
            )}
          </div>
        </motion.div>
        {/* Notes */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.3 }}
        >
          <label className="font-medium text-tertiary text-md mb-2">
            {translations.booking.notes}
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className={`border outline-none ${
              errors.notes ? "border-red-500" : "border-primary"
            } bg-secondary py-2 px-4 w-full rounded-lg`}
          ></textarea>
          {errors.notes && (
            <div className="text-red-500 text-sm mt-1">{errors.notes}</div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div className="flex justify-center mt-8">
          <motion.button
            onClick={handleSubmit}
            className="p-3 rounded-full bg-primary text-white hover:bg-secondary hover:text-primary transition-colors duration-200 flex items-center justify-center"
            disabled={loading} // Disable the button while loading
            variants={{
              hover: {
                scale: 1.05,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
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
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Image
                src={"/images/icon-buy1.png"}
                alt={currentLocale === "ar" ? "Arrow Left" : "Arrow Right"}
                width={24} // Adjust width as needed
                height={24} // Adjust height as needed
                className={`text-xl ${
                  currentLocale === "ar" ? "scale-x-[-1]" : ""
                }`} // Add any additional styling here
              />
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
