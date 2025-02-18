import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { apiSlice } from "./endpoints/apiSlice";
import languageReducer from "./language";

import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    language: languageReducer,
    ...rootReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware);
  },
});

setupListeners(store.dispatch);

export default store;
