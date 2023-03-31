import { AnyAction, combineReducers } from "@reduxjs/toolkit";

import { commentsApi } from "../api/commentsApi";
import { notificationsApi } from "../api/notificationsApi";
import { postsApi } from "../api/postsApi";
import { savedApi } from "../api/savedApi";
import { usersApi } from "../api/usersApi";
import { authSlice } from "../features/auth/authSlice";
import { postModalSlice } from "../features/postModal/postModalSlice";
import { shareSlice } from "../features/share/shareSlice";
import { themeSlice } from "../features/theme/themeSlice";

const appReducer = combineReducers({
  [themeSlice.name]: themeSlice.reducer,
  [shareSlice.name]: shareSlice.reducer,
  [postModalSlice.name]: postModalSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,
  [savedApi.reducerPath]: savedApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
});

const rootReducer = (RootState: any, action: AnyAction) => {
  const state = { ...RootState };

  // control state on action

  return appReducer(state, action);
};

export default rootReducer;
