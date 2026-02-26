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
    return data;
  },
);

// toggle fav btn
export const toggleFavorite = createAsyncThunk(
  "library/toggleFavorite",
  async (bookId, { getState }) => {
    const userId = getState().auth.user.id;

    // find the row first
    const { data: existing } = await supabase
      .from("user_library")
      .select("id, is_favorite")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .maybeSingle();

    if (existing) {
      // exists -> upd
      const { data, error } = await supabase
        .from("user_library")
        .update({ is_favorite: !existing.is_favorite })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // not exist -> insert
      const { data, error } = await supabase
        .from("user_library")
        .insert({ user_id: userId, book_id: bookId, is_favorite: true })
        .select()
        .single();

      if (error) {
        if (error.code === "23505" || error.message?.includes("conflict")) {
          const { data: retryData, error: retryError } = await supabase
            .from("user_library")
            .update({ is_favorite: true })
            .eq("user_id", userId)
            .eq("book_id", bookId)
            .select()
            .single();

          if (retryError) throw retryError;
          return retryData;
        }
        throw error;
      }
      return data;
    }
  },
);

// upd book status
export const updateBookStatus = createAsyncThunk(
  "library/updateStatus",
  async ({ bookId, status }, { getState }) => {
    const userId = getState().auth.user.id;

    const { data, error } = await supabase
      .from("user_library")
      .upsert(
        {
          user_id: userId,
          book_id: bookId,
          status: status,
        },
        { onConflict: "user_id, book_id" },
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  },
);

const initialState = {
  favorites: [],
  wantToRead: [],
  finished: [],
  loading: false,
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
            if (row.is_favorite) state.favorites.push(row.book_id);
            if (row.status === "want_to_read")
              state.wantToRead.push(row.book_id);
            if (row.status === "finished") state.finished.push(row.book_id);
          });
        }
      })

      // toggle fav
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (!action.payload) return;

        const { book_id, is_favorite } = action.payload;
        if (is_favorite) {
          if (!state.favorites.includes(book_id)) state.favorites.push(book_id);
        } else {
          state.favorites = state.favorites.filter((id) => id !== book_id);
        }
      })

      // update status
      .addCase(updateBookStatus.fulfilled, (state, action) => {
        if (!action.payload) return;

        const { book_id, status } = action.payload;

        // rmv
        state.wantToRead = state.wantToRead.filter((id) => id !== book_id);
        state.finished = state.finished.filter((id) => id !== book_id);

        // add
        if (status === "want_to_read") state.wantToRead.push(book_id);
        if (status === "finished") state.finished.push(book_id);
      });
  },
});

export const { clearLibrary } = userLibrarySlice.actions;
export default userLibrarySlice.reducer;
