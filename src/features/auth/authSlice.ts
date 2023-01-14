import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import type { UserType } from "../../common/types/UserType";

const initialState: UserType | null = null;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSignIn: (state, action) => {
      state = action.payload;
    },
    authSignOut: (state) => {
      state = null;
    },
  },
});

export const { authSignIn, authSignOut } = authSlice.actions;
export const authReducer = authSlice.reducer;

// selectors
export const selectAuth = (state: RootState) => state.auth;
