"use client";

import React, { useState } from "react";
import * as Yup from "yup";

interface PersonalData {
  fullName: string;
  mobileNumber: string;
  secondMobileNumber: string;
  favoriteColors: string;
  notes: string;
}

interface PersonalDataProps {
  onSubmit: (personalData: PersonalData) => void; // Callback to send data to the parent
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
    favoriteColors: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    <div className="flex items-center justify-center h-full p-4">
      <div className="w-full max-w-4xl p-6 rounded-lg shadow-md">
        <div className="text-center text-primary font-bold text-2xl mb-6">
          Personal Data
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="font-medium text-tertiary text-md mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`border ${
                errors.fullName ? "border-red-500" : "border-primary"
              } bg-[#f7f4e9] py-2 px-4 rounded-lg`}
            />
            {errors.fullName && (
              <div className="text-red-500 text-sm mt-1">{errors.fullName}</div>
            )}
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col">
            <label className="font-medium text-tertiary text-md mb-2">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className={`border ${
                errors.mobileNumber ? "border-red-500" : "border-primary"
              } bg-[#f7f4e9] py-2 px-4 rounded-lg`}
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
              Second Mobile Number
            </label>
            <input
              type="text"
              name="secondMobileNumber"
              value={formData.secondMobileNumber}
              onChange={handleInputChange}
              className={`border ${
                errors.secondMobileNumber ? "border-red-500" : "border-primary"
              } bg-[#f7f4e9] py-2 px-4 rounded-lg`}
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
              Favorite Colors
            </label>
            <input
              type="text"
              name="favoriteColors"
              value={formData.favoriteColors}
              onChange={handleInputChange}
              className={`border ${
                errors.favoriteColors ? "border-red-500" : "border-primary"
              } bg-[#f7f4e9] py-2 px-4 rounded-lg`}
            />
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
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className={`border ${
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
            className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors duration-200"
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalData;