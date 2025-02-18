"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoginUserMutation } from "@/store/endpoints/apiSlice";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { authenticateUser } from "@/store/authReducer";
import Link from "next/link";
interface LoginFormInputs {
  phoneNumber: string;
  password: string;
}

interface LoginResponse {
  data: {
    id: string;
    phoneNumber: string;
    email_verified_at: string | null;
    type: "User" | "Admin" | "Other";
  };
  message?: string;
  status?: boolean;
}

const schema = yup.object({
  phoneNumber: yup
    .string()
    .matches(/^\d{10,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginUser] = useLoginUserMutation<LoginResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleLogin = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const response = (await loginUser({
        phoneNumber: data.phoneNumber,
        password: data.password,
      }).unwrap()) as unknown as LoginResponse;

      if (response?.data) {
        const userData = response.data;
        dispatch(authenticateUser(userData));
        toast.success("Login Successful! Welcome back.", { autoClose: 2000 });
        router.push("/sidebar/booking");
      } else {
        throw new Error("Invalid phone number or password");
      }
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Login Failed. Please try again.";
      toast.error(errorMessage, { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[75vh] w-full">
      <div className="w-96 text-center">
        <h2 className="text-primary text-3xl font-extrabold">Login</h2>
        <p className="text-sm text-primary mb-9">Welcome Back!</p>

        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col">
          <div className="py-2 px-1 w-full bg-[#EEE7DF] rounded-xl mb-3">
            <input
              type="text"
              placeholder="Enter your mobile number"
              {...register("phoneNumber")}
              className="bg-transparent outline-none px-3 text-tertiary w-full"
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>
          )}

          <div className="py-2 px-1 w-full bg-[#EEE7DF] rounded-xl mb-3">
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="bg-transparent outline-none px-3 text-tertiary w-full"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-center rounded-xl py-2 text-gray-100 cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <Link href={"/SendVerificationCode"}>
          <p className="font-bold text-tertiary py-5">
            Do You Have An Account?
            <span className="text-primary font-bold cursor-pointer">
              {" "}
              Signup
            </span>
          </p>
        </Link>

        <div className="flex items-center justify-center text-sm text-[#7c6d68]">
          <input type="checkbox" className="mr-2" />
          <span>I agree to the Terms of Service</span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
