"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useVerifyCodeMutation } from "@/store/endpoints/apiSlice";
import { authenticateUser } from "@/store/slices/authSlice";

interface VerificationFormInputs {
  code: string;
}

const schema = yup.object({
  code: yup
    .string()
    .matches(/^\d{4}$/, "Code must be a 4-digit number")
    .required("Verification code is required"),
});

const VerificationPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [verifyCode] = useVerifyCodeMutation();
  const [loading, setLoading] = useState<boolean>(false);

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
      const response = await verifyCode({ code: data.code }).unwrap();
      if (response?.data) {
        dispatch(authenticateUser(response.data));
        toast.success("Verification successful!");
        router.push("/");
      } else {
        throw new Error("Invalid verification code");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Enter the 4-digit code
        </h2>
        <p className="text-gray-600 mt-2 mb-6">
          Please check your messages for a 4-digit verification code and enter
          it below to confirm your identity.
        </p>
        <form
          onSubmit={handleSubmit(handleVerify)}
          className="flex flex-col space-y-4"
        >
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
            onClick={() => toast.info("Resend code request sent.")}
          >
            Resend Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificationPage;
