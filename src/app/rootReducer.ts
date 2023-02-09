import { AnyAction, combineReducers } from "@reduxjs/toolkit";

import { authSlice } from "../features/auth/authSlice";
import { postFormReducer } from "../features/postFormSlice";
import { themeSlice } from "../features/theme/themeSlice";
import { commentsApi } from "../services/commentsApi";
import { notificationsApi } from "../services/notificationsApi";
import { postsApi } from "../services/postsApi";
import { savedApi } from "../services/savedApi";
import { usersApi } from "../services/usersApi";

const appReducer = combineReducers({
  [themeSlice.name]: themeSlice.reducer,
  post_form: postFormReducer,
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
