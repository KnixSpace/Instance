import { UserState } from "@/types/userTypes";
import { createSlice } from "@reduxjs/toolkit";

const initialState: UserState = {
  data: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initializeUser(state, action) {
      state.data = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.data = null;
      state.isLoggedIn = false;
    },
  },
});

export const { initializeUser, logout } = userSlice.actions;

export default userSlice.reducer;
