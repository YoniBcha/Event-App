"use client";
import React, { useState } from "react";
import {
  useChangePasswordMutation,
  useGetUserInfoQuery,
  useUpdateProfileMutation,
} from "@/store/endpoints/apiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const { data } = useGetUserInfoQuery<any>({});
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();

  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] =
    useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fullName, setFullName] = useState(data?.data?.fullName || "");
  const [email, setEmail] = useState(data?.data?.email || "");

  const handleUpdateProfile = () => {
    setIsUpdateProfileModalOpen(true);
    setFullName(data?.data?.fullName || "");
    setEmail(data?.data?.email || "");
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  const closeModals = () => {
    setIsUpdateProfileModalOpen(false);
    setIsChangePasswordModalOpen(false);
    setOldPassword("");
    setNewPassword("");
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await changePassword({
        oldPassword,
        newPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      closeModals();
    } catch (error) {
      toast.error("Failed to change password. Please check your old password.");
      console.error("Password change error:", error);
    }
  };

  const handleProfileUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await updateProfile({ fullName, email }).unwrap();
      toast.success("Profile updated successfully!");
      // useGetUserInfoQuery({});
      closeModals();
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    }
  };

  return (
    <div className="flex w-full gap-6 flex-col">
      {/* Toast Container for Notifications */}
      <ToastContainer />

      {/* Update Profile Modal */}
      {isUpdateProfileModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Update Profile</h2>
            <form onSubmit={handleProfileUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 outline-none rounded-lg border border-gray-300"
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 outline-none rounded-lg border border-gray-300"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChangeSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2 outline-none rounded-lg border border-gray-300"
                  placeholder="Old Password"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 outline-none rounded-lg border border-gray-300"
                  placeholder="New Password"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Content */}
      <div className="flex flex-1 flex-col md:flex-row gap-8 w-full items-center">
        <div className="max-md:hidden max-md:justify-center">
          <div className="rounded-full h-20 w-20 bg-slate-500 mb-2 sm:mb-0 sm:mr-4 flex items-center justify-center"></div>
        </div>
        <div className="flex flex-col flex-1 w-full">
          <div className="font-bold">userName</div>
          <div>
            <input
              type="text"
              className="w-full px-4 py-3 outline-none rounded-3xl placeholder:text-gray-500 bg-secondary"
              placeholder={data?.data?.fullName || "user Name"}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between">
        <div className="text-primary flex flex-col gap-1 items-start">
          <div className="text-primary text-lg font-bold">SMS Notification</div>
          <div className="font-extralight text-sm">Receive Updates Via Sms</div>
        </div>
        <div className="text-primary">
          <input type="checkbox" />
        </div>
      </div>

      <div className="flex flex-row items-center justify-between">
        <div className="text-primary flex flex-col gap-1 items-start">
          <div className="text-primary text-lg font-bold">
            Email Notification
          </div>
          <div className="font-extralight text-sm">
            Receive Updates Via Email
          </div>
        </div>
        <div className="text-primary">
          <input type="checkbox" />
        </div>
      </div>

      <hr className="bg-tertiary hidden md:block md:h-0" />
      <div className="font-bold text-2xl">Account Information</div>
      <div className="flex gap-5 flex-col md:flex-row w-full">
        <div className="flex md:w-1/2 flex-col items-start">
          <div>Email</div>
          <input
            type="text"
            className="w-full px-4 py-3 outline-none rounded-3xl placeholder:text-gray-500 bg-secondary"
            placeholder={data?.data?.email || "email@example.com"}
          />
        </div>
        <div className="flex w-full flex-col items-start">
          <div>Phone Number</div>
          <input
            type="text"
            className="w-full px-4 py-3 outline-none rounded-3xl placeholder:text-gray-500 bg-secondary"
            placeholder={data?.data?.phoneNumber || "+1234567890"}
          />
        </div>
      </div>

      <hr className="bg-tertiary hidden md:block md:h-0" />
      <div className="flex flex-row gap-5">
        <div
          className="py-1 px-3 rounded-xl bg-secondary hover:bg-primary hover:text-white cursor-pointer text-primary border border-gray-300"
          onClick={handleUpdateProfile}
        >
          Update Profile
        </div>
        <div
          className="py-1 px-3 rounded-xl bg-secondary hover:bg-primary hover:text-white cursor-pointer text-primary border border-gray-300"
          onClick={handleChangePassword}
        >
          Change Password
        </div>
      </div>
    </div>
  );
}

export default Profile;
