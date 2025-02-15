"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  useVerifyUserMutation,
  useSendVerificationCodeMutation,
} from "@/store/endpoints/apiSlice";
import { authenticateUser } from "@/store/slices/authSlice";

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
  const dispatch = useDispatch();
  const router = useRouter();
  const [verifyUser] = useVerifyUserMutation();
  const [sendVerificationCode] = useSendVerificationCodeMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleVerify = async (data: VerificationFormInputs) => {
    setLoading(true);
    try {
      const response = await verifyUser({
        phoneNumber: data.phoneNumber,
        code: data.code,
      }).unwrap();

      if (response?.data) {
        dispatch(authenticateUser(response.data));
        toast.success("Verification successful!");
        router.push("/enterPassword"); // Redirect to enter password page
      } else {
        throw new Error("Invalid verification code");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async (phoneNumber: string) => {
    if (!phoneNumber) {
      toast.error("Please enter your phone number first.");
      return;
    }

    setResending(true);
    try {
      await sendVerificationCode({ phoneNumber }).unwrap();
      toast.success("Verification code sent successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send code. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Verify Your Account
        </h2>
        <p className="text-gray-600 mt-2 mb-6">
          Enter your phone number and the 4-digit verification code sent to you.
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
            onClick={() =>
              handleResendCode(
                document.querySelector<HTMLInputElement>("[name='phoneNumber']")
                  ?.value || ""
              )
            }
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
