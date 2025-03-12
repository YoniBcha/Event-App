/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { ChromePicker, ColorResult } from "react-color";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaPlus, FaTrash } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";

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
          favoriteColors: [],
          dressColor: [],
          notes: "",
          noOfPeople: 1,
          place: "",
          imageOfPlace: [], // Initialize as empty array for URLs
        };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showFavoriteColorPicker, setShowFavoriteColorPicker] = useState(false);
  const [showDressColorPicker, setShowDressColorPicker] = useState(false);
  const [selectedFavoriteColor, setSelectedFavoriteColor] = useState("#ffffff");
  const [selectedDressColor, setSelectedDressColor] = useState("#ffffff");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const translations = useSelector((state: any) => state.language.translations);
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
      .min(1, "At least one dress color is required"),
    notes: Yup.string().required(`${translations.booking.noteRequire}`),
    noOfPeople: Yup.number()
      .required("Number of people is required")
      .min(1, "At least 1 person is required"),
    place: Yup.string().required("Place is required"),
    imageOfPlace: Yup.array()
      .of(Yup.string().required("An image URL is required"))
      .min(1, "At least one image is required"),
  });

  useEffect(() => {
    const savedData = sessionStorage.getItem("personalData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Loaded data from sessionStorage:", parsedData); // Debugging
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
    setSelectedFavoriteColor(color.hex);
  };

  const handleDressColorChange = (color: ColorResult) => {
    setSelectedDressColor(color.hex);
  };

  const addColor = (field: "favoriteColors" | "dressColor", color: string) => {
    if (!formData[field].includes(color)) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: [...prevData[field], color],
      }));
    }
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
          "https://eventapp-back-cr86.onrender.com/api/v1/admin/upload",
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
      // Check if there are already uploaded images in session storage
      if (formData.imageOfPlace.length > 0) {
        await onSubmit(formData); // Submit the existing data
        return;
      }

      // Upload images and get URLs
      const uploadedUrls = await uploadImages(selectedImages);

      console.log("Uploaded URLs:", JSON.stringify(uploadedUrls, null, 2));

      if (uploadedUrls.length === 0) {
        toast.error("No images were uploaded");
        setLoading(false); // Stop loading on error
        return;
      }

      // Update formData with uploaded image URLs
      const updatedFormData = {
        ...formData,
        imageOfPlace: [...formData.imageOfPlace, ...uploadedUrls],
      };

      // Update the state with the new form data
      setFormData(updatedFormData);

      // Validate the updated form data
      await validationSchema.validate(updatedFormData, { abortEarly: false });

      // Submit the form data
      await onSubmit(updatedFormData); // Ensure onSubmit is awaited
      setErrors({});

      // Clear selected images and previews after successful submission
      setSelectedImages([]);
      setPreviewImages([]);
    } catch (validationErrors) {
      const newErrors: Record<string, string> = {};
      if (validationErrors instanceof Yup.ValidationError) {
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
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <label className="font-medium text-tertiary text-md mb-2">
              {translations.booking.favorite_Colors}
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
              {translations.booking.dress_Colors}
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
                onClick={() => addColor("dressColor", selectedDressColor)}
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
              {formData?.dressColor?.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full m-1 cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => removeColor("dressColor", color)}
                />
              ))}
            </div>
            {errors.dressColor && (
              <div className="text-red-500 text-sm mt-1">
                {errors.dressColor}
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
            ) : currentLocale === "ar" ? (
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
