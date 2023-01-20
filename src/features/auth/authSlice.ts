import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import type { UserType } from "../../common/types/UserType";

const initialState: {
    user: UserType | null;
    status: "INTIAL" | "LOADING" | "AUTHORIZED" | "UNAUTHORIZED";
} = { user: null, status: "INTIAL" };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authLoading: (state) => {
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
export const authReducer = authSlice.reducer;

// selectors
export const selectAuth = (state: RootState) => state.auth;
