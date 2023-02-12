import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type SharePostType = {
  avatar: string;
  author: string;
  text: string;
};

type ShareType = {
  show: boolean;
  post: SharePostType | null;
};

const initialState: ShareType = {
  show: false,
  post: null,
};

export const shareSlice = createSlice({
  name: "share",
  initialState,
  reducers: {
    hideShare: (state) => {
      state.show = false;
      state.post = null;
    },
    showShare: (state, action: { payload: SharePostType }) => {
      state.show = true;
      state.post = action.payload;
    },
  },
});

// actions
export const { hideShare, showShare } = shareSlice.actions;
// selector
export const selectShare = (state: RootState): ShareType => state.share;
