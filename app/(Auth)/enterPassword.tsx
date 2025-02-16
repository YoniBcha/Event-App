// "use client";

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useRegisterUserMutation } from "@/store/endpoints/apiSlice";
// import { useDispatch, useSelector } from "react-redux";
// // import RootState from "@/store/authReducer";
// import { authenticateUser } from "@/store/authReducer";

// interface PasswordFormInputs {
//   password: string;
//   confirmPassword: string;
// }

// const schema = yup.object({
//   password: yup
//     .string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
//   confirmPassword: yup
//     .string()
//     .oneOf([yup.ref("password")], "Passwords must match")
//     .required("Confirm password is required"),
// });

// const EnterPasswordPage: React.FC = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [registerUser] = useRegisterUserMutation();
//   const [loading, setLoading] = useState<boolean>(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<PasswordFormInputs>({
//     resolver: yupResolver(schema),
//     mode: "onChange",
//   });

//   const handleRegister = async (data: PasswordFormInputs) => {
//     setLoading(true);
//     try {
//       const response = await registerUser({
//         fullName,
//         phoneNumber,
//         password: data.password,
//       }).unwrap();

//       if (response?.data) {
//         dispatch(authenticateUser(response.data));
//         toast.success("Registration successful!");
//         router.push("/dashboard"); // Redirect to the main page
//       } else {
//         throw new Error("Registration failed");
//       }
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to register. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
//         <h2 className="text-2xl font-bold text-gray-800">
//           Create Your Password
//         </h2>
//         <p className="text-gray-600 mt-2 mb-6">
//           Enter a strong password to secure your account.
//         </p>

//         <form
//           onSubmit={handleSubmit(handleRegister)}
//           className="flex flex-col space-y-4"
//         >
//           <div className="text-left">
//             <label className="block text-gray-700 font-semibold">
//               Password
//             </label>
//             <input
//               type="password"
//               {...register("password")}
//               className="border border-primary rounded-sm p-3 w-full text-lg outline-none focus:ring-2 focus:ring-primary"
//               placeholder="Enter password"
//             />
//             {errors.password && (
//               <p className="text-red-500 text-sm">{errors.password.message}</p>
//             )}
//           </div>

//           <div className="text-left">
//             <label className="block text-gray-700 font-semibold">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               {...register("confirmPassword")}
//               className="border border-primary rounded-sm p-3 w-full text-lg outline-none focus:ring-2 focus:ring-primary"
//               placeholder="Confirm password"
//             />
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm">
//                 {errors.confirmPassword.message}
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-primary text-white py-2 rounded-md font-semibold cursor-pointer"
//             disabled={loading}
//           >
//             {loading ? "Creating Account..." : "Register"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EnterPasswordPage;
