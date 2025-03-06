/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useSelector } from "react-redux";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  accountNumber: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  name,
  accountNumber,
}) => {
  const translations = useSelector((state: any) => state.language.translations);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {translations.booking.paymentInformation}
        </h2>
        <p className="mb-2">
          <strong>{translations.booking.name}:</strong> {name}
        </p>
        <p className="mb-4">
          <strong>{translations.booking.accountNumber}:</strong> {accountNumber}
        </p>
        <button
          onClick={onClose}
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          {translations.booking.close}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
