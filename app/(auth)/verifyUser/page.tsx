/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  useState,
  useEffect,
  Suspense,
  useRef,
  useCallback,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useVerifyUserMutation,
  useSendVerificationCodeMutation,
} from "@/store/endpoints/apiSlice";

interface VerifyUserResponse {
  data: {
    token: string;
    user: {
      id: string;
      phoneNumber: string;
    };
  };
}

interface VerificationFormInputs {
  phoneNumber: string;
  code: string;
}

const schema = yup.object({
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  code: yup
    .string()
    .matches(/^\d{4}$/, "Code must be a 4-digit number")
    .required("Verification code is required"),
});

const VerificationPage: React.FC = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <VerificationPageContent />
      </Suspense>
      <ToastContainer /> {/* Add this line */}
    </>
  );
};

const VerificationPageContent: React.FC = () => {
  const searchParams = useSearchParams(); // Now inside the Suspense boundary
  const router = useRouter();
  const [verifyUser] = useVerifyUserMutation();
  const [sendVerificationCode] = useSendVerificationCodeMutation();

  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [phoneNumberFromURL, setPhoneNumberFromURL] = useState<string>("");
  const [fullNameFromURL, setFullNameFromURL] = useState<string>("");
  const [digits, setDigits] = useState<string[]>(Array(4).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null));

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerificationFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (searchParams) {
      const phoneNumber = searchParams.get("phoneNumber") || "";
      const fullName = searchParams.get("fullName") || "";
      setPhoneNumberFromURL(phoneNumber);
      setFullNameFromURL(fullName);
      setValue("phoneNumber", phoneNumber); // Set the phone number in the form
    }
  }, [searchParams, setValue]);

  const handleDigitChange = (index: number, value: string) => {
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    setValue("code", newDigits.join(""));
  };

  // Use `useCallback` to create a stable ref callback
  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    []
  );

  const handleVerify: SubmitHandler<VerificationFormInputs> = async (data) => {
    setLoading(true);
    try {
      console.log("Verifying user with:", data); // Debugging
      (await verifyUser({
        phoneNumber: data.phoneNumber,
        code: data.code,
      }).unwrap()) as VerifyUserResponse;
      router.push(
        `/enterPassword?phoneNumber=${encodeURIComponent(
          data.phoneNumber
        )}&fullName=${encodeURIComponent(fullNameFromURL)}`
      );
    } catch (error: any) {
      console.error("Verification error:", error); // Debugging
      toast.error(error?.data?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!phoneNumberFromURL) {
      toast.error("Phone number is missing.");
      return;
    }
    setResending(true);
    try {
      await sendVerificationCode({ phoneNumber: phoneNumberFromURL }).unwrap();
      toast.success("Verification code sent successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send code. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[75vh] w-full">
      <div className="rounded-lg text-center">
        <h2 className="text-2xl font-bold text-primary">Verify Your Account</h2>
        <p className="text-gray-600 mt-2 mb-6">
          Enter the 4-digit verification code sent to your phone.
        </p>

        <form
          onSubmit={handleSubmit(handleVerify)}
          className="flex flex-col items-center space-y-4"
        >
          <div className="flex space-x-2 justify-center">
            {digits.map((digit, index) => (
             <input
             key={index}
             type="number"
             maxLength={1}
             value={digit}
             onChange={(e) => handleDigitChange(index, e.target.value)}
             ref={setInputRef(index)}
             className="border border-primary rounded-lg p-3 text-center text-xl tracking-widest outline-none focus:ring-2 focus:ring-primary w-12 appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
           />
            ))}
          </div>
          {errors.code && (
            <p className="text-red-500 text-sm">{errors.code.message}</p>
          )}

          <button
            type="submit"
            className="bg-primary text-white hover:bg-[#faebdc] hover:text-primary py-2 rounded-md font-semibold cursor-pointer w-1/2"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            className="text-primary text-sm hover:text-gray-500 font-semibold cursor-pointer"
            onClick={handleResendCode}
            disabled={resending}
          >
            {resending ? "Resending..." : "Resend Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificationPage;
