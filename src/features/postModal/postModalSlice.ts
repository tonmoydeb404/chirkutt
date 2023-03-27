import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { PostType } from "../../types/PostType";

type PostFormState = {
  show: boolean;
  type: "CREATE" | "EDIT";
  post: PostType | null;
};

const initialState: PostFormState = {
  show: false,
  type: "CREATE",
  post: null,
};

export const postModalSlice = createSlice({
  name: "post_modal",
  initialState,
  reducers: {
    createPostModal: (state) => {
      state.show = true;
      state.type = "CREATE";
    },
    updatePostModal: (state, { payload }: { payload: PostType }) => {
      state.show = true;
      state.type = "EDIT";
      state.post = payload;
    },
    closePostModal: (state) => {
      state.show = false;
      state.type = "CREATE";
      state.post = null;
    },
  },
});

export const { createPostModal, updatePostModal, closePostModal } =
  postModalSlice.actions;

// selector
export const selectPostModal = (state: RootState): PostFormState =>
  state.post_modal;
