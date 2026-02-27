import { createSlice } from "@reduxjs/toolkit";
const savedTheme = localStorage.getItem("sprite-theme") || "Sunlight";

const initialState = {
  theme: savedTheme,
  contactDraft: localStorage.getItem("sprite-contact-draft") || "",
  filters: {
    category: "All",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "Sunlight" ? "Starlight" : "Sunlight";
      localStorage.setItem("sprite-theme", state.theme);
    },
    updateContactDraft: (state, action) => {
      state.contactDraft = action.payload;
      localStorage.setItem("sprite-contact-draft", action.payload);
    },
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
    },
  },
});

export const { toggleTheme, updateContactDraft, setCategoryFilter } =
  uiSlice.actions;
export default uiSlice.reducer;
