"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps?: number;
}

const ProgressSteps = ({ currentStep, totalSteps = 7 }: ProgressStepsProps) => {
  const [steps, setSteps] = useState<number[]>([]);

  useEffect(() => {
    // Generate steps array based on total steps
    setSteps(Array.from({ length: totalSteps }, (_, i) => i + 1));
  }, [totalSteps]);

  return (
    <div className="w-full flex justify-center px-4">
      <div className="flex items-center justify-between w-full max-w-3xl">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            {/* Step indicator */}
            <div className="relative flex flex-col items-center w-full">
              <motion.div
                className={`flex items-center justify-center rounded-full border-2 ${
                  step < currentStep
                    ? "bg-primary border-primary"
                    : "bg-white border-gray-300"
                }`}
                style={{
                  width: "clamp(1.25rem, 3vw, 1.75rem)",
                  height: "clamp(1.25rem, 3vw, 1.75rem)",
                }}
                initial={false}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {step < currentStep ? (
                  // Checkmark for completed steps
                  <svg
                    className="text-white"
                    style={{
                      width: "clamp(0.875rem, 2.5vw, 1.25rem)",
                      height: "clamp(0.875rem, 2.5vw, 1.25rem)",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                ) : (
                  // Step number for current and future steps
                  <span
                    className={`text-sm font-medium ${
                      step <= currentStep ? "text-white" : "text-gray-500"
                    }`}
                  >
                    <div
                      className="rounded-full bg-gray-300"
                      style={{
                        width: "clamp(0.35rem, 1vw, 0.5rem)",
                        height: "clamp(0.35rem, 1vw, 0.5rem)",
                      }}
                    ></div>
                  </span>
                )}
              </motion.div>
            </div>

            {/* Connector line between steps - EXACTLY as in original code */}
            {index < steps.length - 1 && (
              <div
                className={`w-3 md:w-16 md:h-1 h-[2px] lg:mx-1 ${
                  step < currentStep ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
