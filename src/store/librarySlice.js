import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tomes: [],
  isLoading: false,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setTomes: (state, action) => {
      state.tomes = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setTomes, setLoading } = librarySlice.actions;
export default librarySlice.reducer;
