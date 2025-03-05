"use client";

import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { ChromePicker, ColorResult } from "react-color";
import { motion } from "framer-motion";

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
  const [formData, setFormData] = useState<PersonalData>(() => {
    const savedData = sessionStorage.getItem("personalData");
    return savedData
      ? JSON.parse(savedData)
      : {
          fullName: "",
          mobileNumber: "",
          secondMobileNumber: "",
          favoriteColors: "#ffffff",
          notes: "",
        };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showColorPicker, setShowColorPicker] = useState(false);

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
    favoriteColors: Yup.string().required(
      `${translations.booking.colorRequire}`
    ),
    notes: Yup.string().required(`${translations.booking.noteRequire}`),
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

  const handleColorChange = (color: ColorResult) => {
    setFormData({ ...formData, favoriteColors: color.hex });
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
      <div className="w-full max-w-4xl p-6 max-[500px]:p-3 rounded-lg shadow-md">
        <motion.div
          className="text-center text-primary font-bold text-2xl mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {translations.booking.personalData}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: translations.booking.fullName,
              name: "fullName",
              type: "text",
            },
            {
              label: translations.booking.mobileNumber,
              name: "mobileNumber",
              type: "tel",
            },
            {
              label: translations.booking.secondMobileNumber,
              name: "secondMobileNumber",
              type: "tel",
            },
          ].map((field, index) => (
            <motion.div
              key={field.name}
              className="flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <label className="font-medium text-tertiary text-md mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData] || ""}
                onChange={handleInputChange}
                className={`border outline-none ${
                  errors[field.name as keyof typeof errors]
                    ? "border-red-500"
                    : "border-primary"
                } input-field`}
              />
              {errors[field.name] && (
                <div className="text-red-500 text-sm mt-1">
                  {errors[field.name]}
                </div>
              )}
            </motion.div>
          ))}

          {/* Favorite Colors */}
          <motion.div
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
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
          </motion.div>
        </div>

        {/* Notes */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
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
            } bg-[#f7f4e9] py-2 px-4 w-full rounded-lg`}
          ></textarea>
          {errors.notes && (
            <div className="text-red-500 text-sm mt-1">{errors.notes}</div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div className="flex justify-center mt-8">
          <motion.button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-secondary hover:text-primary transition-colors duration-200"
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
            {translations.booking.nextBtn} &gt;
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default PersonalData;
