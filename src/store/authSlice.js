import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // null -> user is a Visitor
  role: "visitor", // 'visitor', 'user', or 'admin'
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
    logoutUser: (state) => {
      state.user = null;
      state.role = "visitor";
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
