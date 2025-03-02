import React from "react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Payment Information</h2>
        <p className="mb-2"><strong>Name:</strong> {name}</p>
        <p className="mb-4"><strong>Account Number:</strong> {accountNumber}</p>
        <button
          onClick={onClose}
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;