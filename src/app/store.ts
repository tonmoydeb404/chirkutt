import { Store, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../features/auth/authSlice";
import { postFormReducer } from "../features/postFormSlice";
import {
  themeListener,
  themePreloader,
  themeSlice,
} from "../features/theme/themeSlice";
import { commentsApi } from "../services/commentsApi";
import { notificationsApi } from "../services/notificationsApi";
import { postsApi } from "../services/postsApi";
import { savedApi } from "../services/savedApi";
import { usersApi } from "../services/usersApi";
// check dev server
const isDev = import.meta.env.DEV;

export const store: Store = configureStore({
  reducer: {
    [themeSlice.name]: themeSlice.reducer,
    post_form: postFormReducer,
    [authSlice.name]: authSlice.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [savedApi.reducerPath]: savedApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
  },
  devTools: isDev,
  preloadedState: {
    [themeSlice.name]: themePreloader(),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApi.middleware)
      .concat(postsApi.middleware)
      .concat(commentsApi.middleware)
      .concat(savedApi.middleware)
      .concat(notificationsApi.middleware)
      .concat(themeListener.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
