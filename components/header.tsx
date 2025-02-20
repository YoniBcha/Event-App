/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogoutUserMutation } from "@/store/endpoints/apiSlice"; // Adjust the import path
import { logoutUser } from "@/store/authReducer"; // Import the logoutUser action

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const [currentLocale, setCurrentLocale] = useState("en");
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const translations = useSelector((state: any) => state.language.translations);
  const router = useRouter();
  const [logoutUserMutation] = useLogoutUserMutation(); // Initialize the mutation

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const handleLanguageToggle = () => {
    const newLocale = currentLocale === "en" ? "ar" : "en";
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
      setCurrentLocale(newLocale);
      window.location.reload();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLocale = localStorage.getItem("locale") || "en";
      setCurrentLocale(storedLocale);
    }
  }, []);

  // const toggleAccountDropdown = () => {
  //   setIsAccountDropdownOpen(!isAccountDropdownOpen);
  // };

  const toggleAvatarDropdown = () => {
    setIsAvatarDropdownOpen(!isAvatarDropdownOpen);
  };

  const handleLogin = () => {
    router.push("/login");
    setIsAvatarDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUserMutation({}).unwrap(); // Call the logout mutation
      dispatch(logoutUser()); // Dispatch the logout action to update Redux state
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAvatarDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const footerData = {
    socialIcons: [
      "/zip/Social Icons.svg",
      "/zip/Social Icons2.svg",
      "/zip/Social Icons3.svg",
    ],
    copyright: "© 2025 FENZO",
  };

  return (
    <>
      <div className="flex w-full py-6 bg-transparent flex-row justify-between items-center text-sm text-primary">
        <div className="sm:hidden cursor-pointer" onClick={toggleDrawer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 16 16"
          >
            <rect width="16" height="16" fill="none" />
            <path
              fill="#C2937B"
              d="M15 4H1V2h14zm0 5H1V7h14zM1 14h14v-2H1z"
              strokeWidth="0.5"
              stroke="#C2937B"
            />
          </svg>
        </div>

        <div className="hidden sm:flex flex-row gap-5 items-center text-primary ">
          <Link className="hover:text-gray-500 text-xl" href={"/"}>{translations.sidebar.home}</Link>
          <Link className="hover:text-gray-500 text-xl" href={"/designs"}>{translations.sidebar.designs}</Link>
          <Link className="hover:text-gray-500 text-xl" href={"/about"}>{
            translations.sidebar.about
          }</Link>
          <Link className="hover:text-gray-500 text-xl" href={"/contact"}>
            {translations.sidebar.contact}
          </Link>
          <Link className="hover:text-gray-500 text-xl" href={"/mainpage"}>
          { translations.sidebar.booking }
          </Link>
        </div>

        <div className="border p-2 border-primary mx-auto rounded-sm">FENZO</div>

        <div className="sm:flex gap-3 items-center ">
          <div className="sm:flex hidden">
            <div
              className={`flex justify-center items-center h-6 w-6 rounded-sm cursor-pointer ${
                currentLocale === "en"
                  ? "bg-primary text-white"
                  : "border border-primary text-primary"
              }`}
              onClick={handleLanguageToggle}
            >
              EN
            </div>
            <div
              className={`flex justify-center items-center h-6 w-6 rounded-sm cursor-pointer pb-2 ${
                currentLocale === "ar"
                  ? "bg-primary text-white"
                  : "border border-primary text-primary"
              }`}
              onClick={handleLanguageToggle}
            >
              ع
            </div>
          </div>
          <div
            className="h-10 w-10 rounded-full bg-gray-200 cursor-pointer"
            onClick={toggleAvatarDropdown}
            ref={avatarDropdownRef}
          >
            {isAvatarDropdownOpen && (
              <div
                className={`absolute ${
                  currentLocale === "ar" ? "md:left-20 left-[2rem]" : "md:right-20 right-[2rem]"
                } top-16 mt-2 w-48 bg-white border border-primary shadow-lg rounded-md overflow-hidden z-50`}
              >
                <ul className="text-sm text-primary w-full">
                  <li className="flex items-center px-3 gap-2 w-full hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 32 32"
                    >
                      <path
                        fill="#c2937b"
                        d="M16 2a7 7 0 1 0 0 14a7 7 0 0 0 0-14m-6 7a6 6 0 1 1 12 0a6 6 0 0 1-12 0m-2.5 9A3.5 3.5 0 0 0 4 21.5v.667C4 24.317 6.766 30 16 30s12-5.684 12-7.833V21.5a3.5 3.5 0 0 0-3.5-3.5zM5 21.5A2.5 2.5 0 0 1 7.5 19h17a2.5 2.5 0 0 1 2.5 2.5v.667C27 23.684 24.765 29 16 29S5 23.684 5 22.167z"
                      />
                    </svg>
                    <Link
                      href={"/sidebar/profile"}
                      className="block w-full py-2 cursor-pointer"
                    >
                      {translations.sidebar.profile}
                    </Link>
                  </li>
                  <li className="flex w-full px-3 gap-2 hover:bg-gray-100">
                    <Image
                      src={"/zip/file-02.svg"}
                      width={18}
                      height={18}
                      alt="contact"
                    />
                    <Link
                      href={"/sidebar/my-orders"}
                      className="block w-full py-2 cursor-pointer"
                    >
                      {translations.sidebar.myOrders}
                    </Link>
                  </li>
                  {isAuthenticated ? (
                    <li
                      className="flex gap-3 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <Image
                        src={"/zip/elements2.svg"}
                        width={18}
                        height={18}
                        alt="contact"
                      />
                      <p>{ translations.sidebar.logout}</p>
                    </li>
                  ) : (
                    <li
                      className="flex gap-3 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogin}
                    >
                      <Image
                        src={"/zip/elements2.svg"}
                        width={18}
                        height={18}
                        alt="contact"
                      />
                      <p>
                        {translations.sidebar.login}
                      </p>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeDrawer}
        ></div>
      )}

      <div
        className={`fixed top-0 flex flex-col justify-between h-full w-64 bg-white text-primary shadow-lg z-50 transform pt-10 ${
          isOpen
            ? "translate-x-0"
            : currentLocale === "ar"
            ? "translate-x-full"
            : "-translate-x-full"
        } ${
          currentLocale === "ar" ? "right-0" : "left-0"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="">
          <div className="flex justify-between items-center px-6">
            <div className="border p-2 text-primary border-primary rounded-sm">
              FENZO
            </div>
            <button
              className={`absolute ${
                currentLocale == "ar" ? "left-4" : "right-4"
              } text-xl text-primary hover:text-gray-500`}
              onClick={toggleDrawer}
            >
              ✖
            </button>
          </div>
          <nav className="flex flex-col p-6 space-y-4 text-md text-primary">
            {/* Navigation Links */}
            <Link href="/" onClick={toggleDrawer}>
              <div className="flex items-center gap-2">
                <Image
                  src={"/zip/dashboard-square-01.svg"}
                  width={20}
                  height={20}
                  alt="contact"
                />
                <div className="hover:text-gray-500">
                  {translations.sidebar.home}
                </div>
              </div>
            </Link>
            <Link href="/designs" onClick={toggleDrawer}>
              <div className="flex items-center gap-2">
                <Image
                  src={"/zip/file-02.svg"}
                  width={20}
                  height={20}
                  alt="contact"
                />
                  <div className="hover:text-gray-500">    
                  {translations.sidebar.designs}
                </div>
              </div>
            </Link>
            <Link href="/about" onClick={toggleDrawer}>
              <div className="flex items-center gap-2">
                <Image
                  src={"/zip/user-multiple.svg"}
                  width={20}
                  height={20}
                  alt="contact"
                />
                <div className="hover:text-gray-500">
                  {translations.sidebar.about}
                </div>
              </div>
            </Link>
            <Link href="/contact" onClick={toggleDrawer}>
              <div className="flex items-center gap-2">
                <Image
                  src={"/zip/bubble-chat.svg"}
                  width={20}
                  height={20}
                  alt="contact"
                />
                <div className="hover:text-gray-500">
                  {translations.sidebar.contact}
                </div>
              </div>
            </Link>
            <Link href="/mainpage" onClick={toggleDrawer}>
              <div className="flex items-center gap-2">
                <Image
                  src={"/zip/user-multiple.svg"}
                  width={20}
                  height={20}
                  alt="contact"
                />
                <div className="hover:text-gray-500">
                  {translations.sidebar.booking}
                </div>
              </div>
            </Link>
            {/* Language Selector */}
            <div className="flex justify-between">
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="#c2937b"
                    d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2M4.02 16.394l1.338.446L7 19.303v1.283a1 1 0 0 0 .293.707L10 24v2.377a12 12 0 0 1-5.98-9.983M16 28a12 12 0 0 1-2.572-.285L14 26l1.805-4.512a1 1 0 0 0-.097-.926l-1.411-2.117a1 1 0 0 0-.832-.445h-4.93l-1.248-1.873L9.414 14H11v2h2v-2.734l3.868-6.77l-1.736-.992L14.277 7h-2.742L10.45 5.371A11.86 11.86 0 0 1 20 4.7V8a1 1 0 0 0 1 1h1.465a1 1 0 0 0 .832-.445l.877-1.316A12 12 0 0 1 26.894 11H22.82a1 1 0 0 0-.98.804l-.723 4.47a1 1 0 0 0 .54 1.055L25 19l.685 4.056A11.98 11.98 0 0 1 16 28"
                  />
                </svg>
                <div className="">{translations.languages}</div>
              </div>
              <div className="flex items-center">
                <div
                  className={`flex justify-center items-center h-6 w-6 rounded-sm cursor-pointer ${
                    currentLocale === "en"
                      ? "bg-primary text-white"
                      : "border border-primary text-primary"
                  }`}
                  onClick={() => handleLanguageToggle()}
                >
                  EN
                </div>
                <div
                  className={`flex justify-center items-center h-6 w-6 rounded-sm cursor-pointer ${
                    currentLocale === "ar"
                      ? "bg-primary text-white"
                      : "border border-primary text-primary"
                  }`}
                  onClick={() => handleLanguageToggle()}
                >
                  ع
                </div>
              </div>
            </div>
            {/* Account Dropdown */}
            {/* <div className="relative" ref={accountDropdownRef}>
              <div
                className="flex gap-5 items-center cursor-pointer"
                onClick={toggleAccountDropdown}
              >
                <div className="flex gap-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 32 32"
                  >
                    <path
                      fill="#c2937b"
                      d="M16 2a7 7 0 1 0 0 14a7 7 0 0 0 0-14m-6 7a6 6 0 1 1 12 0a6 6 0 0 1-12 0m-2.5 9A3.5 3.5 0 0 0 4 21.5v.667C4 24.317 6.766 30 16 30s12-5.684 12-7.833V21.5a3.5 3.5 0 0 0-3.5-3.5zM5 21.5A2.5 2.5 0 0 1 7.5 19h17a2.5 2.5 0 0 1 2.5 2.5v.667C27 23.684 24.765 29 16 29S5 23.684 5 22.167z"
                    />
                  </svg>
                  <div>{translations.acount}</div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#c2937b"
                    d="m12 13.171l4.95-4.95l1.414 1.415L12 16L5.636 9.636L7.05 8.222z"
                  />
                </svg>
              </div>
              {isAccountDropdownOpen && (
                <div
                  className={`w-48 bg-white rounded-md overflow-hidden mt-2 ${
                    currentLocale === "ar" ? "mr-5" : "ml-5"
                  }`}
                >
                  <ul className="text-sm text-primary">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      My Orders
                    </li>
                  </ul>
                </div>
              )}
            </div> */}
            {/* Log Out Link */}
            {/* {isAuthenticated ? (
              <div onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
              <Image
                src={"/zip/elements2.svg"}
                width={18}
                height={18}
                alt="logout"
              />
              <div className="hover:text-gray-500">Log out</div>
              </div>
            ) : (
              <Link href="/login" onClick={toggleDrawer}>
              <div className="flex items-center gap-2">
                <Image
                src={"/zip/elements2.svg"}
                width={18}
                height={18}
                alt="login"
                />
                <div className="hover:text-gray-500">Log in</div>
              </div>
              </Link>
            )} */}
          </nav>
        </div>
        {/* Footer */}
        <div className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 ">
              {footerData.socialIcons.map((icon, index) => (
                <Image
                  key={index}
                  src={icon}
                  width={20}
                  height={20}
                  alt="social icon"
                />
              ))}
            </div>
            <div className="flex justify-end items-center">
              <div>{footerData.copyright}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
