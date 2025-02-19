import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ">
      <div className="flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-lg w-[40%]">
        {children}
        <button
          onClick={onClose}
          className="mx-auto mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
