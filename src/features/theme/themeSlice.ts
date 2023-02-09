import {
  createListenerMiddleware,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import website from "../../constants/website.json";

type themeState = {
  isDark: boolean;
};

const initialState: themeState = {
  isDark: false,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
  },
});

// actions
export const { toggleTheme } = themeSlice.actions;
// selector
export const selectTheme = (state: RootState): themeState => state.theme;
// listener
export const themeListener = createListenerMiddleware();
themeListener.startListening({
  matcher: isAnyOf(toggleTheme),
  effect: (action, listenerApi) => {
    const state = (listenerApi.getState() as RootState).theme;
    localStorage.setItem(website.themeKey, JSON.stringify(state));
  },
});
// preloader
export const themePreloader = (): themeState => {
  const localTheme = localStorage.getItem(website.themeKey);
  try {
    if (localTheme === null)
      throw Error("error: cannot find value in localstorage");
    const localState = JSON.parse(localTheme);
    if (typeof localState?.isDark !== "boolean")
      throw Error("error: invalid theme state");
    return localState as themeState;
  } catch (error) {
    return initialState;
  }
};
