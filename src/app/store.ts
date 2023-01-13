import { Store, configureStore } from "@reduxjs/toolkit";
import { postFormReducer } from "../services/postFormSlice";

export const store: Store = configureStore({
  reducer: {
    post_form: postFormReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
