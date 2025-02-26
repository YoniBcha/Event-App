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
import { useDispatch, useSelector } from "react-redux";
import { authenticateUser } from "@/store/authReducer";



const EnterPasswordForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [registerUser] = useRegisterUserMutation();
  const [loading, setLoading] = useState(false);

  const phoneNumber = searchParams.get("phoneNumber") || "";
  const fullName = searchParams.get("fullName") || "";
  const translations = useSelector((state: any) => state.language.translations);
  const schema = yup.object({
    password: yup
      .string()
      .min(6, `${translations.login.passwordMust}`)
      .required(`${translations.login.passwordRequire}`),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], `${translations.login.passwordMatch}`)
      .required(`${translations.login.confirmRequire}`),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleRegister = async (data: { password: any }) => {
    if (!phoneNumber || !fullName) {
      toast.error(
        "Missing required information. Please go back and try again."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({
        fullName,
        phoneNumber,
        password: data.password,
      }).unwrap();

      if (response) {
        dispatch(authenticateUser(response));
        toast.success("Registration successful!");
        router.push("/login");
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
    <div className="flex items-center justify-center h-[75vh] w-full">
      <div className="rounded-lg text-center">
      <h2 className="text-2xl font-bold text-primary">
        {translations.login.createPassword}
        </h2>
        <p className="text-tertiary text-center mt-2 mb-6">
          {translations.login.createPasswordSubtitle}
        </p>

        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col space-y-4"
        >
          <div className="text-left">
            <input
              type="password"
              {...register("password")}
              className="border border-primary rounded-lg px-4 py-2 w-full text-lg outline-none focus:ring-1 focus:ring-primary"
              placeholder={translations.login.passwordPlaceholder}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="text-left">
            <input
              type="password"
              {...register("confirmPassword")}
              className="border border-primary rounded-lg px-4 py-2 w-full text-lg outline-none focus:ring-1 focus:ring-primary"
              placeholder={translations.login.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white hover:bg-[#faebdc] hover:text-primary py-2 rounded-md font-semibold cursor-pointer"
            disabled={loading}
          >
            {loading ? translations.login.createAccount : translations.login.register}
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
