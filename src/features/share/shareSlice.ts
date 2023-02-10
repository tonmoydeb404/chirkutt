import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type shareType = {
  show: boolean;
  text: null | string;
  author: string | null;
};

const initialState: shareType = {
  show: false,
  text: null,
  author: null,
};

export const shareSlice = createSlice({
  name: "share",
  initialState,
  reducers: {
    hideShare: (state) => {
      state.show = false;
      state.text = null;
      state.author = null;
    },
    showShare: (
      state,
      action: { payload: { text: string; author: string } }
    ) => {
      state.show = true;
      state.text = action.payload.text;
      state.author = action.payload.author;
    },
  },
});

// actions
export const { hideShare, showShare } = shareSlice.actions;
// selector
export const selectShare = (state: RootState): shareType => state.share;
