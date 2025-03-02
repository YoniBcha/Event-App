import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiSlice as api } from "@/store/endpoints/apiSlice";

const THEME_STORAGE_KEY = "fenzoAppTheme";

const loadThemeFromLocalStorage = () => {
  if (typeof window === "undefined") return null;
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) {
    try {
      return JSON.parse(storedTheme);
    } catch (error) {
      console.error("Failed to parse theme from localStorage", error);
      return null;
    }
  }
  return null;
};

const saveThemeToLocalStorage = (theme) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme.data));
};

export const fetchThemeFromAPI = createAsyncThunk(
  "theme/fetchTheme",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await dispatch(api.endpoints.getThemeColor.initiate());
      if ("data" in response) {
        saveThemeToLocalStorage(response.data);

        return response.data;
      } else {
        return rejectWithValue("Failed to fetch theme data");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const themeSlice = createSlice({
  name: "theme",
  initialState: loadThemeFromLocalStorage() || {
    primaryColor: "#ffffff",
    secondaryColor: "#000000",
    tertiaryColor: "#cccccc",
    logo: "",
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThemeFromAPI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchThemeFromAPI.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { primaryColor, secondaryColor, tertiaryColor, logo } =
          action.payload;
        state.primaryColor = primaryColor;
        state.secondaryColor = secondaryColor;
        state.tertiaryColor = tertiaryColor;
        state.logo = logo;
      })
      .addCase(fetchThemeFromAPI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default themeSlice.reducer;
