/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContactUsMutation } from "@/store/endpoints/apiSlice";
import { toast } from "react-toastify";
import React from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

const contactSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  message: yup
    .string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

interface ContactFormInputs {
  name: string;
  email: string;
  phone: string;
  message: string;
}
interface RootState {
  language: {
    translations: {
      contact: {
      "contactUs": string;
      "callUs": string;
      "callSub": string;
      "chatWithUs": string;
      "chatSub": string;
      "startChat": string;
      "startEmail": string;
      "startInsta": string;
      "visitUs": string;
      "visitSub": string;
      "saudiArabia": string;
      "fullName": string;
      "email": string;
      "phoneNumber": string;
      "message": string;
      "sendMessage": string;
      "sending": string;
      };
    };
  };
}

const ContactUs = () => {
  const [submitContact] = useContactUsMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInputs>({
    resolver: yupResolver(contactSchema),
  });
  const translations = useSelector(
    (state: RootState) => state.language.translations
  );

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    try {
      await submitContact(data).unwrap();
      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">
       {translations.contact.contactUs}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="mb-8">
            <h2 className="text-xl text-[#7f7f7f] font-semibold">{
              translations.contact.callUs}</h2>
            <p className="text-[#7f7f7f] font-regular mt-1">
              {translations.contact.callSub}
            </p>
            <div className="flex gap-2 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <rect width="24" height="24" fill="none" />
                <path
                  fill="#c9a08a"
                  d="m16.052 1.787l.966.261a7 7 0 0 1 4.93 4.934l.26.965l-1.93.521l-.261-.965a5 5 0 0 0-3.522-3.524l-.965-.262zM1 2h8.58l1.487 6.69l-1.86 1.86a14.1 14.1 0 0 0 4.243 4.242l1.86-1.859L22 14.42V23h-1a19.9 19.9 0 0 1-10.85-3.196a20.1 20.1 0 0 1-5.954-5.954A19.9 19.9 0 0 1 1 3zm2.027 2a17.9 17.9 0 0 0 2.849 8.764a18.1 18.1 0 0 0 5.36 5.36A17.9 17.9 0 0 0 20 20.973v-4.949l-4.053-.9l-2.174 2.175l-.663-.377a16.07 16.07 0 0 1-6.032-6.032l-.377-.663l2.175-2.174L7.976 4zm12.111 1.165l.966.261a3.5 3.5 0 0 1 2.465 2.467l.26.965l-1.93.521l-.261-.965a1.5 1.5 0 0 0-1.057-1.057l-.965-.261z"
                  strokeWidth="0.5"
                  stroke="#c9a08a"
                />
              </svg>
              <p className="text-primary font-medium">+966 50 065 9305</p>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl text-[#7f7f7f] font-semibold">
              {translations.contact.chatWithUs}
            </h2>
            <p className="text-[#7f7f7f] font-regular mt-1">
              {translations.contact.chatSub}
            </p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 relative">
                  <Image
                    src={"/images/phone.png"}
                    alt="Phone Icon"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <p className="text-primary underline text-lg">
                  {translations.contact.startChat}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                  className="-ml-1"
                >
                  <rect width="48" height="48" fill="none" />
                  <path
                    fill="none"
                    stroke="#c9a08a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.5 13c13.687 13.574 14.825 13.09 29 0"
                    strokeWidth="1"
                  />
                  <rect
                    width="37"
                    height="31"
                    x="5.5"
                    y="8.5"
                    fill="none"
                    stroke="#c9a08a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    rx="4"
                    ry="4"
                    strokeWidth="1"
                  />
                </svg>
                <p className="text-primary underline text-lg">
                  {translations.contact.startEmail}{" "}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="-ml-1"
                >
                  <rect width="24" height="24" fill="none" />
                  <path
                    fill="#c9a08a"
                    d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                    strokeWidth="0.5"
                    stroke="#c9a08a"
                  />
                </svg>
                <p className="text-primary underline text-lg">
                  {translations.contact.startInsta}{" "}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl text-[#7f7f7f] font-semibold">{translations.contact.visitUs} </h2>
            <p className="text-[#7f7f7f] font-regular mt-1">
              {translations.contact.visitSub}{" "}
            </p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  className="-ml-1"
                >
                  <rect width="21" height="21" fill="none" />
                  <g
                    fill="none"
                    fillRule="evenodd"
                    stroke="#c9a08a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="translate(4 2)"
                    strokeWidth="1"
                  >
                    <path d="m6.5 16.54l.631-.711Q8.205 14.6 9.064 13.49l.473-.624Q12.5 8.875 12.5 6.533C12.5 3.201 9.814.5 6.5.5s-6 2.701-6 6.033q0 2.342 2.963 6.334l.473.624a55 55 0 0 0 2.564 3.05" />
                    <circle cx="6.5" cy="6.5" r="2.5" />
                  </g>
                </svg>
                <p className="text-primary underline text-lg">{
                  translations.contact.saudiArabia}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                {translations.contact.fullName}
              </label>
              <input
                {...register("name")}
                className="border rounded-lg px-3 border-[#e0bfb8] w-full py-2 mt-1 focus:outline-none focus:ring-[#e0bfb8] focus:border-[#e0bfb8] bg-secondary"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {translations.contact.email}
              </label>
              <input
                {...register("email")}
                type="email"
                className="border rounded-lg px-3 border-[#e0bfb8] w-full py-2 mt-1 focus:outline-none focus:ring-[#e0bfb8] focus:border-[#e0bfb8] bg-secondary"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                {translations.contact.phoneNumber}
              </label>
              <input
                {...register("phone")}
                type="tel"
                className="border rounded-lg px-3 border-[#e0bfb8] w-full py-2 mt-1 focus:outline-none focus:ring-[#e0bfb8] focus:border-[#e0bfb8] bg-secondary"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                {translations.contact.message}
              </label>
              <textarea
                {...register("message")}
                rows={2}
                className="border rounded-lg px-3 border-[#e0bfb8] w-full py-2 mt-1 focus:outline-none focus:ring-[#e0bfb8] focus:border-[#e0bfb8] bg-secondary"
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white px-4 py-2 hover:bg-secondary hover:text-primary transition rounded-full cursor-pointer"
            >
              {isSubmitting ? translations.contact.sending : translations.contact.sendMessage}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
