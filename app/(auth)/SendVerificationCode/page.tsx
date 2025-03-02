/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSendVerificationCodeMutation } from "@/store/endpoints/apiSlice";
import Link from "next/link";
import { useSelector } from "react-redux";

interface FormData {
  fullName: string;
  phoneNumber: string;
}

function SendVerificationCode() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const payload = searchParams?.get("payload"); // Get the payload parameter
  const [sendVerificationCode] = useSendVerificationCodeMutation();
  const translations = useSelector((state: any) => state.language.translations);

  const schema = yup.object({
    fullName: yup.string().required(`${translations.login.nameRequire}`),
    phoneNumber: yup
      .string()
      .matches(/^\d{10,15}$/, `${translations.login.phoneMust}`)
      .required(`${translations.login.phoneRequire}`),
  });

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
      const requestPayload = { phoneNumber: data.phoneNumber };

      await sendVerificationCode(requestPayload).unwrap();

      toast.success(translations.login.verificationSuccess, {
        autoClose: 2000,
      });

      // Navigate to verifyUser route with payload if it exists
      router.push(
        `/verifyUser?phoneNumber=${encodeURIComponent(
          data.phoneNumber
        )}&fullName=${encodeURIComponent(data.fullName)}${
          payload ? `&payload=${encodeURIComponent(payload)}` : ""
        }`
      );
    } catch (error: any) {
      toast.error(
        error?.data?.message || translations.login.verificationFailed,
        {
          autoClose: 2000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[75vh] w-full">
      <div className="rounded-lg text-center">
        <div className="text-primary text-3xl font-extrabold">
          {translations.login.verfyTitle}
        </div>
        <div className="text-sm text-primary mb-9">
          {translations.login.verfySubtitle}
        </div>

        <form onSubmit={handleSubmit(handleSendOTP)} className="flex flex-col">
          <div className="py-2 px-1 w-full bg-[#EEE7DF] rounded-xl mb-3">
            <input
              type="text"
              placeholder={translations.login.fullNamePlaceholder}
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
              type="tel"
              placeholder={translations.login.mobilePlaceholder}
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
            {loading ? "Sending OTP..." : translations.login.sendOtp}
          </button>
        </form>

        <Link href={"/login"}>
          <div className="font-bold text-tertiary py-5">
            {translations.login.hasAccount}{" "}
            <span className="text-primary font-bold hover:text-gray-500 cursor-pointer">
              {translations.login.signIn}
            </span>
          </div>
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SendVerificationCode;
