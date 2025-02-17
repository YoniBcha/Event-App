/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import {
  useVerifyUserMutation,
  useSendVerificationCodeMutation,
} from "@/store/endpoints/apiSlice";
import { authenticateUser } from "@/store/authReducer";

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
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationPageContent />
    </Suspense>
  );
};

const VerificationPageContent: React.FC = () => {
  const searchParams = useSearchParams(); // Now inside the Suspense boundary
  const router = useRouter();
  const dispatch = useDispatch();
  const [verifyUser] = useVerifyUserMutation();
  const [sendVerificationCode] = useSendVerificationCodeMutation();

  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [phoneNumberFromURL, setPhoneNumberFromURL] = useState<string>("");
  const [fullNameFromURL, setFullNameFromURL] = useState<string>("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<VerificationFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (searchParams) {
      setPhoneNumberFromURL(searchParams.get("phoneNumber") || "");
      setFullNameFromURL(searchParams.get("fullName") || "");
    }
  }, [searchParams]);

  useEffect(() => {
    if (phoneNumberFromURL) {
      setValue("phoneNumber", phoneNumberFromURL);
    }
  }, [phoneNumberFromURL, setValue]);

  const handleVerify: SubmitHandler<VerificationFormInputs> = async (data) => {
    setLoading(true);
    try {
      const response = (await verifyUser({ phoneNumber: data.phoneNumber, code: data.code }).unwrap()) as VerifyUserResponse;
  
      if (response?.data) {
        dispatch(authenticateUser(response.data));
        toast.success("Verification successful!");
        router.push(`/enterPassword?phoneNumber=${encodeURIComponent(data.phoneNumber)}&fullName=${encodeURIComponent(fullNameFromURL)}`);
      } else {
        throw new Error("Invalid verification code");
      }
    } catch (error: any) {
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
    <div className="flex items-center justify-center">
      <div className="p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold text-primary">
          Verify Your Account
        </h2>
        <p className="text-gray-600 mt-2 mb-6">
          Enter the 4-digit verification code sent to your phone.
        </p>

        <form
          onSubmit={handleSubmit(handleVerify)}
          className="flex flex-col space-y-4"
        >
          <input
            type="text"
            {...register("phoneNumber")}
            className="border border-primary rounded-sm p-3 text-center text-lg outline-none focus:ring-2 focus:ring-primary"
            placeholder="Phone Number"
            disabled
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}

          <input
            type="text"
            {...register("code")}
            maxLength={4}
            className="border border-primary rounded-sm p-3 text-center text-xl tracking-widest outline-none focus:ring-2 focus:ring-primary"
            placeholder="----"
          />
          {errors.code && (
            <p className="text-red-500 text-sm">{errors.code.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md font-semibold cursor-pointer"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            className="text-primary text-sm font-semibold cursor-pointer"
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
