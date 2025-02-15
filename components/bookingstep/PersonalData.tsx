"use client";

import React, { useState } from "react";

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

function PersonalData({ onSubmit }: PersonalDataProps) {
  const [formData, setFormData] = useState<PersonalData>({
    fullName: "",
    mobileNumber: "",
    secondMobileNumber: "",
    favoriteColors: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Validate the form data if needed
    if (
      !formData.fullName ||
      !formData.mobileNumber ||
      !formData.secondMobileNumber ||
      !formData.favoriteColors ||
      !formData.notes
    ) {
      alert("Please fill out all fields.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="">
      <div className="text-center text-primary font-bold text-lg">
        Personal data
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="flex gap-2">
          <div className="">
            <label className="font-medium text-tertiary text-md">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="border border-primary bg-[#f7f4e9] py-2 px-4"
            />
          </div>
          <div className="">
            <label className="font-medium text-tertiary text-md">
              Mobile number
            </label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className="border border-primary bg-[#f7f4e9] py-2 px-4"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="">
            <label className="font-medium text-tertiary text-md">
              Second Mobile number
            </label>
            <input
              type="text"
              name="secondMobileNumber"
              value={formData.secondMobileNumber}
              onChange={handleInputChange}
              className="border border-primary bg-[#f7f4e9] py-2 px-4"
            />
          </div>
          <div className="">
            <label className="font-medium text-tertiary text-md">
              Choose your favorite colors
            </label>
            <input
              type="text"
              name="favoriteColors"
              value={formData.favoriteColors}
              onChange={handleInputChange}
              className="border border-primary bg-[#f7f4e9] py-2 px-4"
            />
          </div>
        </div>
      </div>
      <div className="">
        <label className="font-medium text-tertiary text-md">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          cols={10}
          rows={5}
          className="border border-primary bg-[#f7f4e9] py-2 px-4 w-full"
        ></textarea>
      </div>

      <button
        onClick={handleSubmit}
        className="p-2 rounded-lg bg-primary text-gray-100 cursor-pointer mt-4"
      >
        Next &gt;
      </button>
    </div>
  );
}

export default PersonalData;
