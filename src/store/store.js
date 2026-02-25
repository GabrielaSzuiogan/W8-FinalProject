import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import libraryReducer from "./librarySlice";
import uiReducer from "./uiSlice";
import userLibraryReducer from "./userLibrarySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    library: libraryReducer,
    ui: uiReducer,
    userLibrary: userLibraryReducer,
  },
});
