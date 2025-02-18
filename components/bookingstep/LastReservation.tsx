import React from "react";

interface LastReservationProps {
  onNext: (value: boolean) => void; // Callback to send `true` to the parent
}

const LastReservation: React.FC<LastReservationProps> = ({ onNext }) => {
  const handleNextClick = () => {
    onNext(true); // Send `true` to the parent when the "Next" button is clicked
  };

  return (
    <div className="flex flex-col justify-center gap-4 items-center h-full">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <p className="text-gray-600 mb-6">Thank you</p>
        <p className="text-gray-700 mb-8">
          The reservation process has been completed successfully.
          <br />
          Please complete your personal information to view the costs.
        </p>
        <button
          onClick={handleNextClick}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LastReservation;