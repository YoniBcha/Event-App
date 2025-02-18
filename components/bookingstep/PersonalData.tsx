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
    <div className="flex items-center justify-center h-full">
      <div className="w-full md:w-[40%]">
        <div className="text-center text-primary font-bold text-lg">
          Personal data
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:justify-evenly md:flex-row gap-2">
            <div className="">
              <div className="font-medium text-tertiary text-md">Full Name</div>
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
                <div className="text-red-500 text-sm">{errors.fullName}</div>
              )}
            </div>
            <div className="">
              <div className="font-medium text-tertiary text-md">
                Mobile number
              </div>
              <input
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className={`border ${
                  errors.mobileNumber ? "border-red-500" : "border-primary"
                } bg-[#f7f4e9] py-2 px-4 rounded-lg`}
              />
              {errors.mobileNumber && (
                <div className="text-red-500 text-sm">
                  {errors.mobileNumber}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col md:justify-evenly md:flex-row gap-2">
            <div className="">
              <div className="font-medium text-tertiary text-md">
                Second Mobile number
              </div>
              <input
                type="text"
                name="secondMobileNumber"
                value={formData.secondMobileNumber}
                onChange={handleInputChange}
                className={`border ${
                  errors.secondMobileNumber
                    ? "border-red-500"
                    : "border-primary"
                } bg-[#f7f4e9] py-2 px-4 rounded-lg`}
              />
              {errors.secondMobileNumber && (
                <div className="text-red-500 text-sm">
                  {errors.secondMobileNumber}
                </div>
              )}
            </div>
            <div className="">
              <div className="font-medium text-tertiary text-md">
                Choose your favorite colors
              </div>
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
                <div className="text-red-500 text-sm">
                  {errors.favoriteColors}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mx-4">
          <div className="font-medium text-tertiary text-md">Notes</div>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            cols={5}
            rows={3}
            className={`border ${
              errors.notes ? "border-red-500" : "border-primary"
            } bg-[#f7f4e9] py-2 px-4 w-full rounded-lg`}
          ></textarea>
          {errors.notes && (
            <div className="text-red-500 text-sm">{errors.notes}</div>
          )}
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={handleSubmit}
            className="p-2 rounded-lg bg-primary text-gray-100 cursor-pointer mt-4"
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalData;
