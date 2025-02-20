"use client";

import React, { useState } from "react";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { ChromePicker, ColorResult } from "react-color";

interface PersonalData {
  fullName: string;
  mobileNumber: string;
  secondMobileNumber: string;
  favoriteColors: string;
  notes: string;
}

interface PersonalDataProps {
  onSubmit: (personalData: PersonalData) => void;
}

// Yup validation schema
const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  mobileNumber: Yup.string()
    .required("Mobile Number is required")
    .matches(/^[0-9]{10}$/, "Mobile Number must be 10 digits"),
  secondMobileNumber: Yup.string()
    .required("Second Mobile Number is required")
    .matches(/^[0-9]{10}$/, "Second Mobile Number must be 10 digits"),
  favoriteColors: Yup.string().required("Favorite Colors is required"),
  notes: Yup.string().required("Notes is required"),
});

function PersonalData({ onSubmit }: PersonalDataProps) {
  const [formData, setFormData] = useState<PersonalData>({
    fullName: "",
    mobileNumber: "",
    secondMobileNumber: "",
    favoriteColors: "#ffffff", // Default color
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showColorPicker, setShowColorPicker] = useState(false); // State to toggle color picker
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
        };
      };
    };
  }

  const translations = useSelector((state: RootState) => state.language.translations);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the error for the field when the user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleColorChange = (color: ColorResult) => {
    setFormData({ ...formData, favoriteColors: color.hex }); // Update the color in form data
  };

  const handleSubmit = async () => {
    try {
      // Validate the form data using Yup
      await validationSchema.validate(formData, { abortEarly: false });
      // If validation passes, submit the form
      onSubmit(formData);
      setErrors({}); // Clear any previous errors
    } catch (validationErrors) {
      // Handle validation errors
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
    <div className="flex items-center justify-center h-full max-[500px]:p-1 p-4">
      <div className="w-full max-w-4xl p-6 max-[500px]:p-3 rounded-lg shadow-md">
        <div className="text-center text-primary font-bold text-2xl mb-6">
          {translations.booking.personalData}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
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
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col">
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.mobileNumber}
            </label>
            <input
              type="text"
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
          </div>

          {/* Second Mobile Number */}
          <div className="flex flex-col">
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.secondMobileNumber}
            </label>
            <input
              type="text"
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
          </div>

          {/* Favorite Colors */}
          <div className="flex flex-col">
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.pickColor}
            </label>
            <div className="relative">
              <div
                className="w-10 h-10 rounded-lg cursor-pointer border border-primary"
                style={{ backgroundColor: formData.favoriteColors }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              {showColorPicker && (
                <div className="absolute z-10 mt-2">
                  <ChromePicker
                    color={formData.favoriteColors}
                    onChange={handleColorChange}
                  />
                </div>
              )}
            </div>
            {errors.favoriteColors && (
              <div className="text-red-500 text-sm mt-1">
                {errors.favoriteColors}
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
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
            } bg-[#f7f4e9] py-2 px-4 w-full rounded-lg`}
          ></textarea>
          {errors.notes && (
            <div className="text-red-500 text-sm mt-1">{errors.notes}</div>
          )}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-primary hover:bg-[#faebdc] hover:text-primary text-white hover:bg-primary-dark transition-colors duration-200"
          >
            { translations.booking.nextBtn} &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalData;
