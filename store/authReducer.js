import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie"; // Import js-cookie

const initializeUser = () => {
  if (typeof window !== "undefined") {
    const item = Cookies.get("user-info");
    return item ? JSON.parse(item) : null;
  }
};

const initializeAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!Cookies.get("user-info");
  }
};

const initializeToken = () => {
  if (typeof window !== "undefined") {
    return Cookies.get("token") || null;
  }
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initializeToken(),
    isAuthenticated: initializeAuthenticated(),
    user: initializeUser(),
    notifications: [],
    csrf_token: "",
  },
  reducers: {
    authenticateUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.token = action.payload.token;
      Cookies.set("user-info", JSON.stringify(state.user), { expires: 1 });
      Cookies.set("token", state.token, { expires: 1 });
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      Cookies.remove("user-info");
      Cookies.remove("token");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      Cookies.set("user-info", JSON.stringify(state.user), { expires: 1 });
    },
    socialAuthenticate: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      Cookies.set("token", state.token, { expires: 1 });
    },
    setCSRFToken: (state, action) => {
      state.csrf_token = action.payload;
    },
    pushNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  authenticateUser,
  logoutUser,
  socialAuthenticate,
  setCSRFToken,
  setUser,
  pushNotification,
  removeNotifications,
} = authSlice.actions;

export default authSlice.reducer;
