import { Store, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/authSlice";
import { postFormReducer } from "../features/postFormSlice";

// check dev mode on or off
const isDev = import.meta.env.DEV;

export const store: Store = configureStore({
    reducer: {
        post_form: postFormReducer,
        auth: authReducer,
    },
    devTools: isDev,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
