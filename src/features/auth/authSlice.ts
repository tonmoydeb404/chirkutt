import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { AuthType, AuthUserType } from "../../types/AuthType";

const initialState: AuthType = { user: null, status: "INTIAL" };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLoading: (state) => {
      state.user = null;
      state.status = "LOADING";
    },
    authSignIn: (state, { payload }: { payload: AuthUserType }) => {
      state.user = payload;
      state.status = "AUTHORIZED";
    },
    authSignOut: (state) => {
      state.user = null;
      state.status = "UNAUTHORIZED";
    },
  },
});

export const { authSignIn, authSignOut, authLoading } = authSlice.actions;

// selectors
export const selectAuth = (state: RootState): AuthType => state.auth;
