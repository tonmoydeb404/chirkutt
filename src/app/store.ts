import { Store, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/authSlice";
import { postFormReducer } from "../features/postFormSlice";

export const store: Store = configureStore({
  reducer: {
    post_form: postFormReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
