import { createSlice } from "@reduxjs/toolkit";
import arTranslations from "@/locales/ar.json" assert { type: "json" };
import enTranslations from "@/locales/en.json" assert { type: "json" };

const DEFAULT_LOCALE = "en";

const getStoredLocale = () => {
  if (typeof window !== "undefined") {
    const storedLocale = localStorage.getItem("locale");
    return storedLocale || DEFAULT_LOCALE;
  }
  return DEFAULT_LOCALE;
};

const initialState = {
  currentLocale: getStoredLocale(),
  translations: getStoredLocale() === "ar" ? arTranslations : enTranslations,
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action) => {
      const locale = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", locale);
      }
      state.currentLocale = locale;
      state.translations = locale === "ar" ? arTranslations : enTranslations;
    },
  },
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
