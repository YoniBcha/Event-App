/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "@/store/index";
import { useGetThemeColorQuery } from "@/store/endpoints/apiSlice";
import { fetchThemeFromAPI } from "@/store/themeSlice";
// import SplashCursor from "@/components/animation/SplashCursor";

interface WithStoreProps {
  children: ReactNode;
}

const WithStore = ({ children }: WithStoreProps) => {
  return (
    <div className="h-screen flex flex-col">
      <Provider store={store}>
        <ThemeFetcherAndApplier />

        {children}
      </Provider>
    </div>
  );
};

const ThemeFetcherAndApplier = () => {
  const { data } = useGetThemeColorQuery<any>({});
  const { primaryColor, secondaryColor, font, tertiaryColor } =
    data?.data || {};
  const dispatch = useDispatch<any>();
  useEffect(() => {
    dispatch(fetchThemeFromAPI());
    if (primaryColor) {
      document.documentElement.style.setProperty("--primary", primaryColor);
    }
    if (secondaryColor) {
      document.documentElement.style.setProperty("--secondary", secondaryColor);
    }
    if (tertiaryColor) {
      document.documentElement.style.setProperty("--tertiary", tertiaryColor);
    }
    if (font) {
      document.documentElement.style.setProperty("--font-primary", font);
    }
  }, [primaryColor, secondaryColor, tertiaryColor, dispatch, font]);

  return null;
};

export default WithStore;
