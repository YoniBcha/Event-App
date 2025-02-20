/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSendVerificationCodeMutation } from "@/store/endpoints/apiSlice";
import Link from "next/link";

interface FormData {
  fullName: string;
  phoneNumber: string;
}

const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d{10,15}$/, "Invalid phone number")
    .required("Phone number is required"),
});

function SendVerificationCode() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [sendVerificationCode] = useSendVerificationCodeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleSendOTP: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      // Send only the phoneNumber in the payload
      const payload = { phoneNumber: data.phoneNumber };

      await sendVerificationCode(payload).unwrap();

      toast.success("Verification code sent to your phone!");

      router.push(
        `/verifyUser?phoneNumber=${encodeURIComponent(
          data.phoneNumber
        )}&fullName=${encodeURIComponent(data.fullName)}`
      );
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[75vh] w-full">
      <div className="rounded-lg text-center">
        <div className="text-primary text-3xl font-extrabold">
          Verify Your Phone!
        </div>
        <div className="text-sm text-primary mb-9">
          Enter your details to receive a verification code.
        </div>

        <form onSubmit={handleSubmit(handleSendOTP)} className="flex flex-col">
          <div className="py-2 px-1 w-full bg-[#EEE7DF] rounded-xl mb-3">
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullName")}
              className="bg-transparent outline-none flex justify-start px-3 text-tertiary w-full"
            />
          </div>
          {errors.fullName && (
            <p className="text-red-500 text-xs">{errors.fullName.message}</p>
          )}

          {/* Phone Number Input */}
          <div className="py-2 px-1 w-full bg-[#EEE7DF] rounded-xl mb-3">
            <input
              type="text"
              placeholder="Enter your mobile number"
              {...register("phoneNumber")}
              className="bg-transparent outline-none flex justify-start px-3 text-tertiary w-full"
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-center hover:bg-[#faebdc] hover:text-primary rounded-xl py-2 text-gray-100 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <Link href={"/login"}>
          <div className="font-bold text-tertiary py-5">
            Already have an account?{" "}
            <span className="text-primary font-bold hover:text-gray-500 cursor-pointer">Sign in</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default SendVerificationCode;
