/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { FaTrash, FaUpload, FaClock, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  useGetDepositAmountQuery,
  useDepositeMutation,
} from "@/store/endpoints/apiSlice";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  status: string;
  accountNumber: string;
  orderId: string;
  onPaymentComplete: (receiptImages: string[]) => void;
  onApprovalChange?: (status: "underReview" | "approved") => void;
}

// type PaymentStatus = "underReview" | "underProcessing" | "approved";

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  name,
  status,
  accountNumber,
  orderId,
  onPaymentComplete,
  onApprovalChange,
}) => {
  const translations = useSelector((state: any) => state.language.translations);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string>(status);
  const [isUploading, setIsUploading] = useState(false);
  const [hasSelectedImage, setHasSelectedImage] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const currentLocale = useSelector(
    (state: any) => state.language.currentLocale
  );

  // Get deposit amount query
  const {
    data: depositData,
    isLoading: isDepositLoading,
    refetch,
  } = useGetDepositAmountQuery(orderId, {
    skip: !orderId || !isOpen,
  }) as any;

  // Deposit mutation
  const [depositMutation, { isLoading: isDepositSubmitting }] =
    useDepositeMutation();

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageSelection(e.dataTransfer.files);
    }
  }, []);

  // Reset all states when orderId changes or modal opens
  useEffect(() => {
    if (isOpen && orderId) {
      setIsLoading(true);
      setDepositAmount("");
      setSelectedImages([]);
      setPreviewImages([]);
      setHasSelectedImage(false);
      setPaymentStatus(status);
      refetch();
    }
  }, [isOpen, orderId, refetch]);
  console.log("status" + status);
  // Update deposit amount when new data arrives
  useEffect(() => {
    if (depositData) {
      setDepositAmount(depositData.data?.depositAmount || "");
      setIsLoading(false);
    }
  }, [depositData]);

  // Handle loading state for deposit query
  useEffect(() => {
    setIsLoading(isDepositLoading);
  }, [isDepositLoading]);

  const handleImageSelection = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedImages([file]);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImages([previewUrl]);
      setHasSelectedImage(true);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImages([]);
    setPreviewImages([]);
    setHasSelectedImage(false);
  };

  const uploadImages = async (files: File[]) => {
    const uploadedUrls: string[] = [];
    setIsUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("images", file);
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

    try {
      setIsUploading(true);
      const uploadedUrls = await uploadImages(selectedImages);

      if (uploadedUrls.length > 0) {
        const depositResponse = (await depositMutation({
          orderId,
          receiptImage: uploadedUrls[0],
        }).unwrap()) as any;

        if (depositResponse.status) {
          onPaymentComplete(uploadedUrls);
          setPaymentStatus("paymentSent");
          onApprovalChange?.("underReview");
          toast.success("Payment submitted successfully!");
        }
      }
    } catch (error) {
      console.error("Payment submission failed:", error);
      toast.error("Payment submission failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // const approvePayment = () => {
  //   setPaymentStatus("underProcess");
  //   onApprovalChange?.("approved");
  //   toast.success("Payment approved successfully!");
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2 sm:p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
          {
            translations[
              paymentStatus === "approved"
                ? "paymentApproved"
                : paymentStatus === "underProcessing"
                ? "paymentUnderReview"
                : "paymentInformation"
            ]
          }
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-40 sm:h-64">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : paymentStatus === "accepted" ? (
          <>
            <div className="mb-4 sm:mb-6 bg-secondary p-3 sm:p-4 rounded-lg border border-primary">
              <h1 className="text-primary text-lg sm:text-xl font-bold">
                {translations.booking.depositMessage.replace(
                  "{percentage}",
                  "30%"
                )}
                {depositAmount && (
                  <span className="text-black mt-1 sm:mt-2 text-base sm:text-lg flex items-center">
                    Amount to pay: {depositAmount}{" "}
                    <Image
                      src="/images/SR.png"
                      alt="SR"
                      width={16}
                      height={16}
                      className={`ml-1 w-4 h-4 sm:w-5 sm:h-5 ${
                        currentLocale === "ar" ? "scale-x-[-1]" : ""
                      }`}
                    />
                  </span>
                )}
              </h1>
              <p className="mt-2 sm:mt-4 text-sm sm:text-base font-medium text-black">
                <strong>{translations.booking.name}:</strong> {name}
              </p>
              <p className="text-sm sm:text-base font-medium text-black">
                <strong>{translations.booking.accountNumber}:</strong>{" "}
                {accountNumber}
              </p>
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                {translations.booking.uploadPaymentReceipt}
              </label>

              <motion.div
                className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
                  isDragging ? "border-primary bg-blue-50" : "border-gray-300"
                }`}
                whileHover={{ scale: 1.01 }}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {previewImages.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {previewImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={img}
                          alt={`Receipt preview ${index}`}
                          width={200}
                          height={200}
                          className="object-cover h-24 sm:h-32 w-full rounded-md"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTrash size={12} className="sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                    <FaUpload className="text-gray-400 text-3xl sm:text-4xl mb-2 sm:mb-3" />
                    <p className="text-gray-500 text-sm sm:text-base mb-2 sm:mb-3">
                      {isDragging
                        ? translations.booking.dropFilesHere
                        : translations.booking.dragDropReceipt}
                    </p>
                  </div>
                )}

                {!hasSelectedImage && (
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                    <label className="cursor-pointer bg-primary text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md inline-flex items-center text-sm sm:text-base">
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
                        className="text-red-600 hover:text-red-800 text-xs sm:text-sm"
                      >
                        {translations.booking.clearAll}
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
              <button
                onClick={onClose}
                className="w-full sm:w-auto text-primary font-bold px-3 py-1 sm:px-2 sm:py-1 border border-primary rounded-xl hover:text-secondary text-sm sm:text-base"
              >
                {translations.booking.cancel}
              </button>

              <button
                onClick={handleSubmitPayment}
                disabled={
                  previewImages.length === 0 ||
                  isUploading ||
                  isDepositSubmitting
                }
                className={`w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base ${
                  previewImages.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark text-white"
                }`}
              >
                {isUploading || isDepositSubmitting
                  ? translations.booking.uploading
                  : translations.booking.submitPayment}
              </button>
            </div>
          </>
        ) : paymentStatus === "paymentSent" ? (
          <div className="text-center py-4 sm:py-6">
            <div className="text-yellow-500 text-4xl sm:text-5xl mb-3 sm:mb-4">
              <FaClock className="inline-block" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
              {translations.booking.paymentUnderReview}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
              {translations.booking.paymentReviewMessage}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base"
              >
                {translations.booking.close}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 sm:py-6">
            <div className="text-green-500 text-4xl sm:text-5xl mb-3 sm:mb-4">
              <FaCheckCircle className="inline-block" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">
              {translations.booking.paymentApproved}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
              {translations.booking.paymentApprovedMessage}
            </p>
            <button
              onClick={onClose}
              className="bg-primary text-white px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base"
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
