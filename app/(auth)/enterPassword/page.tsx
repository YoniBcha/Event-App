/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRegisterUserMutation } from "@/store/endpoints/apiSlice";
import { useDispatch } from "react-redux";
import { authenticateUser } from "@/store/authReducer";

const schema = yup.object({
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm password is required"),
});

const EnterPasswordForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [registerUser] = useRegisterUserMutation();
  const [loading, setLoading] = useState(false);

  const phoneNumber = searchParams.get("phoneNumber") || "";
  const fullName = searchParams.get("fullName") || "";

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleRegister = async (data: { password: any; }) => {
    if (!phoneNumber || !fullName) {
      toast.error("Missing required information. Please go back and try again.");
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({ fullName, phoneNumber, password: data.password }).unwrap();

      if (response) {
        dispatch(authenticateUser(response));
        toast.success("Registration successful!");
        router.push("/dashboard");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Create Your Password</h2>
        <p className="text-gray-600 mt-2 mb-6">Enter a strong password to secure your account.</p>

        <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col space-y-4">
          <div className="text-left">
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              {...register("password")}
              className="border border-primary rounded-sm p-3 w-full text-lg outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="text-left">
            <label className="block text-gray-700 font-semibold">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="border border-primary rounded-sm p-3 w-full text-lg outline-none focus:ring-2 focus:ring-primary"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" className="w-full bg-primary text-white py-2 rounded-md font-semibold cursor-pointer" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

const EnterPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnterPasswordForm />
    </Suspense>
  );
};

export default EnterPasswordPage;
