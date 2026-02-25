import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../services/supabase";

export const fetchTomes = createAsyncThunk("library/fetchTomes", async () => {
  const { data, error } = await supabase.from("tomes").select("*");

  if (error) throw error;
  return data;
});

const initialState = {
  tomes: [],
  isLoading: false,
  error: null,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    addTome: (state, action) => {
      state.tomes.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTomes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTomes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tomes = action.payload;
      })
      .addCase(fetchTomes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { addTome } = librarySlice.actions;
export default librarySlice.reducer;
