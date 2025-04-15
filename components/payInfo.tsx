/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { FaTrash, FaUpload, FaClock, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  accountNumber: string;
  onPaymentComplete: (receiptImages: string[]) => void;
  onApprovalChange?: (status: "pending" | "approved") => void;
}

type PaymentStatus = "not_uploaded" | "under_review" | "approved";

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  name,
  accountNumber,
  onPaymentComplete,
  onApprovalChange,
}) => {
  const translations = useSelector((state: any) => state.language.translations);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>("not_uploaded");
  const [isUploading, setIsUploading] = useState(false);
  const [hasSelectedImage, setHasSelectedImage] = useState(false); // ✅ NEW

  const handleImageSelection = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0]; // Only use the first file
      setSelectedImages([file]);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImages([previewUrl]);
      setHasSelectedImage(true); // ✅ Hide buttons once image is selected
    }
  };

  const handleRemoveImage = () => {
    setSelectedImages([]);
    setPreviewImages([]);
    setHasSelectedImage(false); // ✅ Reset so buttons show again
  };

  const uploadImages = async (files: File[]) => {
    const uploadedUrls: string[] = [];
    setIsUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("images", file);
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
          console.error(result.message || "Upload failed");
        }
      }
    } catch (error) {
      console.error("Upload error", error);
    } finally {
      setIsUploading(false);
    }
    return uploadedUrls;
  };

  const handleSubmitPayment = async () => {
    if (selectedImages.length === 0) return;
    const uploadedUrls = await uploadImages(selectedImages);
    if (uploadedUrls.length > 0) {
      onPaymentComplete(uploadedUrls);
      setPaymentStatus("under_review");
      onApprovalChange?.("pending");
    }
  };

  const approvePayment = () => {
    setPaymentStatus("approved");
    onApprovalChange?.("approved");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <h2 className="text-xl font-bold mb-4">
          {
            translations[
              paymentStatus === "approved"
                ? "paymentApproved"
                : paymentStatus === "under_review"
                ? "paymentUnderReview"
                : "paymentInformation"
            ]
          }
        </h2>

        {paymentStatus === "not_uploaded" ? (
          <>
            <div className="mb-6 bg-secondary p-4 rounded-lg border border-primary">
              {/* <h3 className="font-semibold text-primary mb-2 text-lg">
                {translations.booking.depositInstructions}
              </h3> */}
              <h1 className="text-primary text-xl font-bold">
                {translations.booking.depositMessage.replace(
                  "{percentage}",
                  "30%"
                )}
              </h1>
              <p className="mt-4 font-medium text-black">
                <strong>{translations.booking.name}:</strong> {name}
              </p>
              <p className="font-medium text-black">
                <strong>{translations.booking.accountNumber}:</strong>{" "}
                {accountNumber}
              </p>
            </div>

            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">
                {translations.booking.uploadPaymentReceipt}
              </label>

              <motion.div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                whileHover={{ scale: 1.01 }}
              >
                {previewImages.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    {previewImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={img}
                          alt={`Receipt preview ${index}`}
                          width={200}
                          height={200}
                          className="object-cover h-32 w-full rounded-md"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <FaUpload className="text-gray-400 text-4xl mb-3" />
                    <p className="text-gray-500 mb-3">
                      {translations.booking.dragDropReceipt}
                    </p>
                  </div>
                )}

                {/* ✅ Hide buttons after image is selected */}
                {!hasSelectedImage && (
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md inline-flex items-center">
                      <span>{translations.booking.selectFiles}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelection(e.target.files)}
                        className="hidden"
                      />
                    </label>

                    {previewImages.length > 0 && (
                      <button
                        onClick={handleRemoveImage}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        {translations.booking.clearAll}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="text-primary font-bold px-2 py-1 border border-primary rounded-xl hover:text-secondary"
              >
                {translations.booking.cancel}
              </button>

              <button
                onClick={handleSubmitPayment}
                disabled={previewImages.length === 0 || isUploading}
                className={`px-4 py-2 rounded-md ${
                  previewImages.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark text-white"
                }`}
              >
                {isUploading
                  ? translations.booking.uploading
                  : translations.booking.submitPayment}
              </button>
            </div>
          </>
        ) : paymentStatus === "under_review" ? (
          <div className="text-center py-6">
            <div className="text-yellow-500 text-5xl mb-4">
              <FaClock className="inline-block" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {translations.booking.paymentUnderReview}
            </h3>
            <p className="text-gray-600 mb-6">
              {translations.booking.paymentReviewMessage}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md"
              >
                {translations.booking.close}
              </button>
              <button
                onClick={approvePayment}
                className="bg-primary text-white px-6 py-2 rounded-md"
              >
                Approve (Demo)
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-green-500 text-5xl mb-4">
              <FaCheckCircle className="inline-block" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {translations.booking.paymentApproved}
            </h3>
            <p className="text-gray-600 mb-6">
              {translations.booking.paymentApprovedMessage}
            </p>
            <button
              onClick={onClose}
              className="bg-primary text-white px-6 py-2 rounded-md"
            >
              {translations.booking.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
