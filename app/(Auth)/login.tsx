"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoginUserMutation } from "@/store/endpoints/apiSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authenticateUser } from "@/store/slices/authSlice";

interface LoginFormInputs {
  phoneNumber: string;
  password: string;
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
  const [loginUser] = useLoginUserMutation();
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
      const response = await loginUser({
        phoneNumber: data.phoneNumber,
        password: data.password,
      }).unwrap();

      if (response?.data) {
        const userData = response.data;
        dispatch(authenticateUser(userData));

        toast.success("Login Successful! Welcome back.");

        if (!userData.email_verified_at) {
          router.push("/confirm-email");
        } else if (userData.type === "User") {
          router.push("/intro");
        } else {
          router.push("/(home)");
        }
      } else {
        throw new Error("Invalid phone number or password");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Login Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[75vh] w-full">
      <div className="w-96 text-center">
        <div className="text-primary text-3xl font-extrabold">Login</div>
        <div className="text-sm text-primary mb-9">Welcome Back!</div>

        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col">
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

          <div className="py-2 px-1 w-full bg-[#EEE7DF] rounded-xl mb-3">
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="bg-transparent outline-none flex justify-start px-3 text-tertiary w-full"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-center rounded-xl py-2 text-gray-100 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="font-bold text-tertiary py-5">
          Do You Have An Account?
          <span className="text-primary font-bold cursor-pointer"> Signup</span>
        </div>

        <div className="flex items-center justify-center text-sm text-[#7c6d68]">
          <input type="checkbox" className="mr-2" />
          <span>I agree to the Terms of Service</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
