import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import libraryReducer from "./librarySlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    library: libraryReducer,
    ui: uiReducer,
  },
});
