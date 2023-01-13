import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

type PostFormState = {
  show: boolean;
};

const initialState: PostFormState = {
  show: false,
};

const postFormSlice = createSlice({
  name: "post_form",
  initialState,
  reducers: {
    openPostForm: (state) => {
      state.show = true;
    },
    closePostForm: (state) => {
      state.show = false;
    },
  },
});

export const { openPostForm, closePostForm } = postFormSlice.actions;
export const postFormReducer = postFormSlice.reducer;

// selector
export const selectPostForm = (state: RootState) => state.post_form;
