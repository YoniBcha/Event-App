"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRegisterUserMutation } from "@/store/endpoints/apiSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

// Define TypeScript types
interface RegisterFormData {
  name: string;
  phoneNumber: string;
}

// Validation schema
const schema = yup.object({
  name: yup.string().required("Name is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d{10,15}$/, "Invalid phone number")
    .required("Phone number is required"),
});

function Register() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [registerUser] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const response = await registerUser(data).unwrap();
      toast.success("Registration Successful! Welcome to our platform.");
      dispatch(authenticateUser(response.data));
      router.push("/confirm-email");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Registration Failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[75vh] w-full bg-[#FBF9F1]">
      <div className="w-96 text-center">
        <div className="text-primary text-3xl font-extrabold">
          Create Your Account!!
        </div>
        <div className="text-sm text-primary mb-9">
          Welcome To You With Finzo Family!
        </div>

        <form onSubmit={handleSubmit(handleRegister)} className="flex flex-col">
          <div className="py-2 px-1 w-full bg-[#EEE7DF] rounded-xl mb-3">
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className="bg-transparent outline-none flex justify-start px-3 text-tertiary w-full"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}

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

          <button
            type="submit"
            className="w-full bg-primary text-center rounded-xl py-2 text-gray-100 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div className="font-bold text-tertiary py-5">
          Do You Have An Account?{" "}
          <span className="text-primary font-bold cursor-pointer">Signin</span>
        </div>
      </div>
    </div>
  );
}

export default Register;
