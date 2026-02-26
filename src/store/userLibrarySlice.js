import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../services/supabase";

// fetch all books
export const fetchUserLibrary = createAsyncThunk(
  "library/fetch",
  async (userId) => {
    const { data, error } = await supabase
      .from("user_library")
      .select("book_id, status, is_favorite")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  },
);

// toggle fav btn
export const toggleFavorite = createAsyncThunk(
  "library/toggleFavorite",
  async (bookId, { getState }) => {
    const userId = getState().auth.user.id;
    const { data: existing } = await supabase
      .from("user_library")
      .select("*")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("user_library")
        .update({ is_favorite: !existing.is_favorite })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("user_library")
        .insert({ user_id: userId, book_id: bookId, is_favorite: true })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },
);

// upd book status
export const updateBookStatus = createAsyncThunk(
  "library/updateStatus",
  async ({ bookId, status }, { getState }) => {
    const userId = getState().auth.user.id;
    const { data: existing } = await supabase
      .from("user_library")
      .select("*")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("user_library")
        .update({ status: status })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("user_library")
        .insert({ user_id: userId, book_id: bookId, status: status })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },
);

const initialState = {
  favorites: [],
  wantToRead: [],
  finished: [],
};

const userLibrarySlice = createSlice({
  name: "userLibrary",
  initialState,
  reducers: {
    clearLibrary: (state) => {
      state.favorites = [];
      state.wantToRead = [];
      state.finished = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLibrary.fulfilled, (state, action) => {
        state.favorites = [];
        state.wantToRead = [];
        state.finished = [];

        if (action.payload) {
          action.payload.forEach((row) => {
            const id = String(row.book_id);
            if (row.is_favorite) state.favorites.push(id);
            if (row.status === "want_to_read") state.wantToRead.push(id);
            if (row.status === "finished") state.finished.push(id);
          });
        }
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (!action.payload) return;
        const id = String(action.payload.book_id);

        if (action.payload.is_favorite) {
          if (!state.favorites.includes(id)) state.favorites.push(id);
        } else {
          state.favorites = state.favorites.filter((favId) => favId !== id);
        }
      })
      .addCase(updateBookStatus.fulfilled, (state, action) => {
        if (!action.payload) return;
        const id = String(action.payload.book_id);
        const { status } = action.payload;

        state.wantToRead = state.wantToRead.filter((listId) => listId !== id);
        state.finished = state.finished.filter((listId) => listId !== id);

        if (status === "want_to_read") state.wantToRead.push(id);
        if (status === "finished") state.finished.push(id);
      });
  },
});

export const { clearLibrary } = userLibrarySlice.actions;
export default userLibrarySlice.reducer;
