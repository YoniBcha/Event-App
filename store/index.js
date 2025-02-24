import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer"; // Your existing root reducer
import { apiSlice } from "./endpoints/apiSlice"; // Your API slice
import languageReducer from "./language"; // Your language reducer
import themeReducer from "./themeSlice"; // Import your theme slice reducer
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query API slice
    language: languageReducer, // Language reducer
    theme: themeReducer, // Add your theme reducer here
    ...rootReducer, // Any other reducers
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check if needed
    }).concat(apiSlice.middleware); // Add RTK Query middleware
  },
});

setupListeners(store.dispatch); // Optional: Enable RTK Query listeners

export default store;
