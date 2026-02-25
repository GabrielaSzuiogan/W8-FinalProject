import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: [],
  wantToRead: [],
  finished: [],
};

const userLibrarySlice = createSlice({
  name: "userLibrary",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const bookId = action.payload;
      if (state.favorites.includes(bookId)) {
        state.favorites = state.favorites.filter((id) => id !== bookId);
      } else {
        state.favorites.push(bookId);
      }
    },
    addToWantToRead: (state, action) => {
      const bookId = action.payload;
      if (!state.wantToRead.includes(bookId)) {
        state.wantToRead.push(bookId);
        state.finished = state.finished.filter((id) => id !== bookId);
      }
    },
    addToFinished: (state, action) => {
      const bookId = action.payload;
      if (!state.finished.includes(bookId)) {
        state.finished.push(bookId);
        state.wantToRead = state.wantToRead.filter((id) => id !== bookId);
      }
    },
  },
});

export const { toggleFavorite, addToWantToRead, addToFinished } =
  userLibrarySlice.actions;
export default userLibrarySlice.reducer;
