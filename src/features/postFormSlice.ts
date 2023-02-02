import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { PostType } from "../types/PostType";

type PostFormState = {
  show: boolean;
  type: "CREATE" | "EDIT";
  defaultValue: null | PostType;
};

const initialState: PostFormState = {
  show: false,
  type: "CREATE",
  defaultValue: null,
};

const postFormSlice = createSlice({
  name: "post_form",
  initialState,
  reducers: {
    openPostForm: (
      state,
      {
        payload,
      }: { payload: { type: "CREATE" | "EDIT"; value?: null | PostType } }
    ) => {
      state.show = true;
      state.type = payload.type;
      if (payload.value) state.defaultValue = payload.value;
    },
    closePostForm: (state) => {
      state.show = false;
      state.type = "CREATE";
      state.defaultValue = null;
    },
  },
});

export const { openPostForm, closePostForm } = postFormSlice.actions;
export const postFormReducer = postFormSlice.reducer;

// selector
export const selectPostForm = (state: RootState): PostFormState =>
  state.post_form;
