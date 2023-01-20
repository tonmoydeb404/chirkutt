import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { AuthType } from "../../types/AuthType";

const initialState: AuthType = { user: null, status: "INTIAL" };

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authLoading: (state) => {
            state.user = null;
            state.status = "LOADING";
        },
        authSignIn: (state, action) => {
            state.user = action.payload;
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
export const selectAuth = (state: RootState) => state.auth;
