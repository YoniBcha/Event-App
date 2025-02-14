import { createSlice } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";

const initializeUser = () => {
  if (typeof window !== "undefined") {
    const item = window?.localStorage.getItem("user-info");
    return item ? JSON.parse(item) : null;
  }
};

const initializeAuthenticated = () => {
  if (typeof window !== "undefined") {
    const item = window?.localStorage.getItem("user-info");
    return item ? true : false;
  }
};

const initializeToken = () => {
  if (typeof window !== "undefined") {
    const item = window?.localStorage.getItem("token");
    return item ? item : null;
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
      window?.localStorage.setItem("user-info", JSON.stringify(state.user));
      window?.localStorage.setItem("token", state.token);
    },
    logoutUser: (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      window?.localStorage.removeItem("user-info");
      window?.localStorage.removeItem("token");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      window?.localStorage.setItem("user-info", JSON.stringify(state.user));
    },
    socialAuthenticate: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    setCSRFToken: (state, action) => {
      state.csrf_token = action.payload;
    },
    pushNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotifications: (state, action) => {
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
