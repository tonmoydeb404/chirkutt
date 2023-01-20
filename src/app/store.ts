import { Store, configureStore } from "@reduxjs/toolkit";

import { authSlice } from "../features/auth/authSlice";
import { postFormReducer } from "../features/postFormSlice";
import { postsApi } from "../services/postsApi";
import { usersApi } from "../services/usersApi";

// check dev mode on or off
const isDev = import.meta.env.DEV;

export const store: Store = configureStore({
    reducer: {
        post_form: postFormReducer,
        [authSlice.name]: authSlice.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [postsApi.reducerPath]: postsApi.reducer,
    },
    devTools: isDev,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(usersApi.middleware)
            .concat(postsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
