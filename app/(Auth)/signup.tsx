// "use client";

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useSendVerificationCodeMutation } from "@/store/endpoints/apiSlice"; 

// const schema = yup.object({
//   name: yup.string().required("Name is required"),
//   phoneNumber: yup
//     .string()
//     .matches(/^\d{10,15}$/, "Invalid phone number")
//     .required("Phone number is required"),
// });

// function Register() {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const [sendVerificationCode] = useSendVerificationCodeMutation(); // ✅ Add this mutation

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     mode: "onChange",
//   });

//   const handleSendOTP = async (data) => {
//     setLoading(true);
//     try {
//       await sendVerificationCode({ phoneNumber: data.phoneNumber }).unwrap();
//       toast.success("Verification code sent to your phone!");
//       router.push("/verify");
//     } catch (error) {
//       toast.error(
//         error?.data?.message || "Failed to send OTP. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-[75vh] w-full bg-[#FBF9F1]">
//       <div className="w-96 text-center">
//         <div className="text-primary text-3xl font-extrabold">
//           Verify Your Phone!
//         </div>
//         <div className="text-sm text-primary mb-9">
//           Enter your details to receive a verification code.
//         </div>

//         <form onSubmit={handleSubmit(handleSendOTP)} className="flex flex-col">
//           <div className="py-2 px-1 w-full bg-[#EEE7DF] rounded-xl mb-3">
//             <input
//               type="text"
//               placeholder="Name"
//               {...register("name")}
//               className="bg-transparent outline-none flex justify-start px-3 text-tertiary w-full"
//             />
//           </div>
//           {errors.name && (
//             <p className="text-red-500 text-xs">{errors.name.message}</p>
//           )}

//           <div className="py-2 px-1 w-full bg-[#EEE7DF] rounded-xl mb-3">
//             <input
//               type="text"
//               placeholder="Enter your mobile number"
//               {...register("phoneNumber")}
//               className="bg-transparent outline-none flex justify-start px-3 text-tertiary w-full"
//             />
//           </div>
//           {errors.phoneNumber && (
//             <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>
//           )}

//           <button
//             type="submit"
//             className="w-full bg-primary text-center rounded-xl py-2 text-gray-100 cursor-pointer"
//             disabled={loading}
//           >
//             {loading ? "Sending OTP..." : "Send OTP"}
//           </button>
//         </form>

//         <div className="font-bold text-tertiary py-5">
//           Already have an account?{" "}
//           <span className="text-primary font-bold cursor-pointer">Sign in</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;
