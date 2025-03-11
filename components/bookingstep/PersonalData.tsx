/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { ChromePicker, ColorResult } from "react-color";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa";

interface PersonalData {
  fullName: string;
  mobileNumber: string;
  secondMobileNumber: string;
  favoriteColors: string[]; // For favorite colors
  dressColors: string[]; // For dress colors
  notes: string;
  numberOfPeople: number; // Number of people invited
  place: string; // Place for the event
  images: File[]; // Multiple images
}

interface PersonalDataProps {
  onSubmit: (personalData: PersonalData) => void;
}

function PersonalData({ onSubmit }: PersonalDataProps) {
  const [formData, setFormData] = useState<PersonalData>(() => {
    const savedData = sessionStorage.getItem("personalData");
    return savedData
      ? JSON.parse(savedData)
      : {
          fullName: "",
          mobileNumber: "",
          secondMobileNumber: "",
          favoriteColors: [], // Initialize as an empty array
          dressColors: [], // Initialize as an empty array
          notes: "",
          numberOfPeople: 1, // Default to 1
          place: "", // Initialize as empty
          images: [], // Initialize as empty array
        };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showFavoriteColorPicker, setShowFavoriteColorPicker] = useState(false); // For favorite colors
  const [showDressColorPicker, setShowDressColorPicker] = useState(false); // For dress colors
  const [selectedFavoriteColor, setSelectedFavoriteColor] = useState("#ffffff"); // Selected favorite color
  const [selectedDressColor, setSelectedDressColor] = useState("#ffffff"); // Selected dress color

  interface RootState {
    language: {
      translations: {
        booking: {
          personalData: string;
          fullName: string;
          mobileNumber: string;
          secondMobileNumber: string;
          pickColor: string;
          notes: string;
          nextBtn: string;
          fullNameRequire: string;
          colorRequire: string;
          noteRequire: string;
          mobileRequire: string;
          secondMobileRequire: string;
          mobileMust: string;
          secondMobileMust: string;
          secondMobileNotMatch: string;
        };
      };
    };
  }

  const translations = useSelector(
    (state: RootState) => state.language.translations
  );
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );

  // Yup validation schema
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
      .min(1, `${translations.booking.colorRequire}`), // Validate at least one favorite color
    dressColors: Yup.array()
      .of(Yup.string())
      .min(1, "At least one dress color is required"), // Validate at least one dress color
    notes: Yup.string().required(`${translations.booking.noteRequire}`),
    numberOfPeople: Yup.number()
      .required("Number of people is required")
      .min(1, "At least 1 person is required"),
    place: Yup.string().required("Place is required"),
    images: Yup.array()
      .of(Yup.mixed().required("An image is required"))
      .min(1, "At least one image is required"),
  });

  // Load saved data from sessionStorage on component mount
  useEffect(() => {
    const savedData = sessionStorage.getItem("personalData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Loaded data from sessionStorage:", parsedData); // Debugging
        setFormData(parsedData);
      } catch (error) {
        console.error("Error parsing sessionStorage data:", error);
      }
    }
  }, []);

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    console.log("Saving data to sessionStorage:", formData); // Debugging
    sessionStorage.setItem("personalData", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleFavoriteColorChange = (color: ColorResult) => {
    setSelectedFavoriteColor(color.hex); // Update the selected favorite color
  };

  const handleDressColorChange = (color: ColorResult) => {
    setSelectedDressColor(color.hex); // Update the selected dress color
  };

  const addColor = (field: "favoriteColors" | "dressColors", color: string) => {
    if (!formData[field].includes(color)) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: [...prevData[field], color],
      }));
    }
    if (field === "favoriteColors") {
      setShowFavoriteColorPicker(false); // Close the favorite color picker
    } else {
      setShowDressColorPicker(false); // Close the dress color picker
    }
  };

  const removeColor = (
    field: "favoriteColors" | "dressColors",
    color: string
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((c) => c !== color),
    }));
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      onSubmit(formData);
      setErrors({});
    } catch (validationErrors) {
      const newErrors: Record<string, string> = {};
      if (validationErrors instanceof Yup.ValidationError) {
        validationErrors.inner.forEach((error) => {
          newErrors[error.path as string] = error.message;
        });
      }
      setErrors(newErrors);
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

          {/* Number of People Invited */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              Number of People Invited
            </label>
            <input
              type="number"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleInputChange}
              min={1}
              className={`border outline-none ${
                errors.numberOfPeople ? "border-red-500" : "border-primary"
              } input-field appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />
            {errors.numberOfPeople && (
              <div className="text-red-500 text-sm mt-1">
                {errors.numberOfPeople}
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
              Place
            </label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              className={`border outline-none ${
                errors.place ? "border-red-500" : "border-primary"
              } input-field`}
            />
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
              Upload Images (Multiple)
            </label>
            <input
              type="file"
              name="images"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setFormData({ ...formData, images: files });
              }}
              className="border outline-none border-primary input-field"
            />
            {errors.images && (
              <div className="text-red-500 text-sm mt-1">{errors.images}</div>
            )}
          </motion.div>

          {/* Favorite Colors */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              Favorite Colors
            </label>
            <div className="flex items-center gap-2">
              {/* Color Preview */}
              <div
                className="w-10 h-10 rounded-lg cursor-pointer border border-primary"
                style={{
                  backgroundColor: selectedFavoriteColor,
                }}
                onClick={() =>
                  setShowFavoriteColorPicker(!showFavoriteColorPicker)
                }
              />
              {/* + Button to Add Color */}
              <button
                onClick={() =>
                  addColor("favoriteColors", selectedFavoriteColor)
                }
                className="p-2 rounded-full bg-primary text-white hover:bg-secondary transition-colors duration-200"
              >
                <FaPlus />
              </button>
            </div>
            {/* Color Picker */}
            {showFavoriteColorPicker && (
              <div className="mt-2">
                <ChromePicker
                  color={selectedFavoriteColor}
                  onChange={handleFavoriteColorChange}
                />
              </div>
            )}
            {/* Display Selected Favorite Colors */}
            <div className="flex flex-wrap mt-2">
              {formData.favoriteColors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full m-1 cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => removeColor("favoriteColors", color)}
                />
              ))}
            </div>
            {errors.favoriteColors && (
              <div className="text-red-500 text-sm mt-1">
                {errors.favoriteColors}
              </div>
            )}
          </motion.div>

          {/* Dress Colors */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              Dress Colors
            </label>
            <div className="flex items-center gap-2">
              {/* Color Preview */}
              <div
                className="w-10 h-10 rounded-lg cursor-pointer border border-primary"
                style={{
                  backgroundColor: selectedDressColor,
                }}
                onClick={() => setShowDressColorPicker(!showDressColorPicker)}
              />
              {/* + Button to Add Color */}
              <button
                onClick={() => addColor("dressColors", selectedDressColor)}
                className="p-2 rounded-full bg-primary text-white hover:bg-secondary transition-colors duration-200"
              >
                <FaPlus />
              </button>
            </div>
            {/* Color Picker */}
            {showDressColorPicker && (
              <div className="mt-2">
                <ChromePicker
                  color={selectedDressColor}
                  onChange={handleDressColorChange}
                />
              </div>
            )}
            {/* Display Selected Dress Colors */}
            <div className="flex flex-wrap mt-2">
              {formData.dressColors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full m-1 cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => removeColor("dressColors", color)}
                />
              ))}
            </div>
            {errors.dressColors && (
              <div className="text-red-500 text-sm mt-1">
                {errors.dressColors}
              </div>
            )}
          </motion.div>
        </div>

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
            className="p-3 rounded-full bg-primary text-white hover:bg-secondary hover:text-primary transition-colors duration-200"
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
            {currentLocale === "ar" ? (
              <FaArrowLeft className="text-xl" />
            ) : (
              <FaArrowRight className="text-xl" />
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default PersonalData;
