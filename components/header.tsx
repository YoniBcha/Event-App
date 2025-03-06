/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useLogoutUserMutation } from "@/store/endpoints/apiSlice"; // Adjust the import path
import { logoutUser } from "@/store/authReducer"; // Import the logoutUser action
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { FaUser, FaBoxOpen, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { FaHome, FaFileAlt, FaUsers, FaComments, FaBook } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  // const accountDropdownRef = useRef<HTMLDivElement>(null);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const [currentLocale, setCurrentLocale] = useState("en");
  const [logo, setLogo] = useState("/path/to/default/logo.png");
  const pathname = usePathname(); // Get the current path

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure we're on the client side
    const storedTheme = localStorage.getItem("fenzoAppTheme");
    if (storedTheme) {
      try {
        const { logo } = JSON.parse(storedTheme);
        setLogo(logo);
      } catch (error) {
        console.error("Failed to parse stored theme:", error);
      }
    }
  }, []);

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

  const handleClick = () => {
    sessionStorage.clear(); // Clears all sessionStorage data
  };

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
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(event.target as Node)
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
      {
        icon: <FaInstagram className="text-2xl text-primary" />,
        link: "https://www.instagram.com",
      },
      {
        icon: <FaTiktok className="text-2xl text-primary" />,
        link: "https://www.tiktok.com",
      },
      {
        icon: <FaYoutube className="text-2xl text-primary" />,
        link: "https://www.youtube.com",
      },
    ],
    copyright: "© 2025 FENZO",
  };

  // Framer Motion Variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const drawerVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  return (
    <>
      <motion.div
        initial={{ x: "100%" }} // Start from right corner
        animate={{ x: "0%" }} // Move to left
        transition={{
          stiffness: 100, // Adjusts the bounciness
          damping: 10, // Controls how quickly it settles
        }}
        className="flex w-full py-6 bg-transparent flex-row justify-between  items-center text-sm text-primary"
      >
        {/* Left Side Navigation (Hamburger Menu) */}
        <div
          className="[@media(min-width:1000px)]:hidden cursor-pointer"
          onClick={toggleDrawer}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 16 16"
          >
            <rect width="16" height="16" fill="none" />
            <path
              fill="var(--primary)"
              d="M15 4H1V2h14zm0 5H1V7h14zM1 14h14v-2H1z"
              strokeWidth="0.5"
              stroke="var(--secondary)"
            />
          </svg>
        </div>

        {/* Center Navigation Links (Hidden on Small Screens) */}
        <div className="hidden [@media(min-width:1000px)]:flex flex-row gap-5 items-center text-primary">
          <Link
            className={`hover:text-gray-500 hover:-translate-y-1 duration-200 text-lg ${
              pathname === "/"
                ? "font-bold border-b-2 border-primary text-primary"
                : ""
            }`}
            href={"/"}
          >
            {translations.sidebar.home}
          </Link>
          <Link
            className={`hover:text-gray-500 hover:-translate-y-1 duration-200 text-lg ${
              pathname.startsWith("/designs")
                ? "font-bold border-b-2 border-primary text-primary"
                : ""
            }`}
            href={"/designs"}
          >
            {translations.sidebar.designs}
          </Link>
          <Link
            className={`hover:text-gray-500 hover:-translate-y-1 duration-200 text-lg ${
              pathname === "/about"
                ? "font-bold border-b-2 border-primary text-primary"
                : ""
            }`}
            href={"/about"}
          >
            {translations.sidebar.about}
          </Link>
          <Link
            className={`hover:text-gray-500 hover:-translate-y-1 duration-200 text-lg ${
              pathname === "/contact"
                ? "font-bold border-b-2 border-primary text-primary"
                : ""
            }`}
            href={"/contact"}
          >
            {translations.sidebar.contact}
          </Link>
          <Link
            className={`hover:text-gray-500 hover:-translate-y-1 duration-200 text-lg ${
              pathname.startsWith("/mainpage")
                ? "font-bold border-b-2 border-primary text-primary"
                : ""
            }`}
            href={"/mainpage/1"}
            onClick={handleClick} // Clears sessionStorage on click
          >
            {translations.sidebar.booking}
          </Link>
        </div>

        {/* Centered FENZO Logo */}
        <div className="flex-grow flex justify-center">
          {logo.length < 1 ? (
            <div className="flex items-center justify-center text-primary text-lg font-bold">
              Logo
            </div>
          ) : (
            <Image src={logo} alt="Logo" width={100} height={50} />
          )}
        </div>

        {/* Right Side Icons (Language Toggle and Avatar) */}
        <div className="sm:flex gap-3 items-center">
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
            <AnimatePresence>
              {isAvatarDropdownOpen && (
                <motion.div
                  ref={avatarDropdownRef}
                  className={`absolute ${
                    currentLocale === "ar"
                      ? "md:left-20 left-[2rem]"
                      : "md:right-20 right-[2rem]"
                  } top-16 mt-2 w-48 backdrop-blur-xl bg-gradient-to-r from-secondary to-white border border-primary shadow-lg rounded-md overflow-hidden z-50`}
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <ul className="text-sm text-primary w-full">
                    {isAuthenticated ? (
                      <>
                        {/* Profile */}
                        <li className="flex items-center px-3 gap-2 w-full hover:bg-secondary">
                          <FaUser className="text-primary" size={18} />{" "}
                          {/* Profile Icon */}
                          <Link
                            href="/sidebar/profile"
                            className="block w-full py-2 cursor-pointer"
                          >
                            {translations.sidebar.profile}
                          </Link>
                        </li>

                        {/* My Orders */}
                        <li className="flex items-center w-full px-3 gap-2 hover:bg-secondary">
                          <FaBoxOpen className="text-primary" size={18} />{" "}
                          {/* My Orders Icon */}
                          <Link
                            href="/sidebar/my-orders"
                            className="block w-full py-2 cursor-pointer"
                          >
                            {translations.sidebar.myOrders}
                          </Link>
                        </li>

                        {/* Logout */}
                        <li
                          className="flex gap-3 w-full px-4 py-2 hover:bg-secondary cursor-pointer"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="text-primary" size={18} />{" "}
                          {/* Logout Icon */}
                          <p>{translations.sidebar.logout}</p>
                        </li>
                      </>
                    ) : (
                      /* Login */
                      <li
                        className="flex gap-3 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleLogin}
                      >
                        <FaSignInAlt className="text-primary" size={18} />{" "}
                        {/* Login Icon */}
                        <p>{translations.sidebar.login}</p>
                      </li>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeDrawer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed top-0 flex flex-col justify-between h-full w-64 bg-white text-primary shadow-lg z-50 transform pt-10 ${
              currentLocale === "ar" ? "right-0" : "left-0"
            }`}
            variants={drawerVariants}
            initial={{ x: currentLocale === "ar" ? "100%" : "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: currentLocale === "ar" ? "100%" : "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="">
              <div className="flex justify-between items-center px-6">
                <Image src={logo} alt="Logo" width={100} height={50} />
                <button
                  className={`absolute ${
                    currentLocale === "ar" ? "left-4" : "right-4"
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
                    <FaHome className="text-xl" />
                    <div
                      className={`hover:text-gray-500 ${
                        pathname === "/"
                          ? "font-bold border-b-2 border-primary text-primary"
                          : ""
                      }`}
                    >
                      {translations.sidebar.home}
                    </div>
                  </div>
                </Link>
                <Link href="/designs" onClick={toggleDrawer}>
                  <div className="flex items-center gap-2">
                    <FaFileAlt className="text-xl" />
                    <div
                      className={`hover:text-gray-500 ${
                        pathname.startsWith("/designs")
                          ? "font-bold border-b-2 border-primary text-primary"
                          : ""
                      }`}
                    >
                      {translations.sidebar.designs}
                    </div>
                  </div>
                </Link>
                <Link href="/about" onClick={toggleDrawer}>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-xl" />
                    <div
                      className={`hover:text-gray-500 ${
                        pathname === "/about"
                          ? "font-bold border-b-2 border-primary text-primary"
                          : ""
                      }`}
                    >
                      {translations.sidebar.about}
                    </div>
                  </div>
                </Link>
                <Link href="/contact" onClick={toggleDrawer}>
                  <div className="flex items-center gap-2">
                    <FaComments className="text-xl" />
                    <div
                      className={`hover:text-gray-500 ${
                        pathname === "/contact"
                          ? "font-bold border-b-2 border-primary text-primary"
                          : ""
                      }`}
                    >
                      {translations.sidebar.contact}
                    </div>
                  </div>
                </Link>

                <Link
                  href="/mainpage/1"
                  onClick={() => {
                    toggleDrawer();
                    handleClick();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FaBook className="text-xl" />
                    <div
                      className={`hover:text-gray-500 ${
                        pathname.startsWith("/mainpage")
                          ? "font-bold border-b-2 border-primary text-primary"
                          : ""
                      }`}
                    >
                      {translations.sidebar.booking}
                    </div>
                  </div>
                </Link>
                {/* Language Selector */}
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <MdLanguage className="text-xl text-[#c2937b]" />
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
              </nav>
            </div>
            {/* Footer */}
            <div className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 ">
                  {footerData.socialIcons.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
                <div className="flex justify-end items-center">
                  <div>{footerData.copyright}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
