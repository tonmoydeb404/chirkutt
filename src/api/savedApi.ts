import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { SAVED, USERS } from "../constants/firebase.constant";
import {
  createDocument,
  deleteDocument,
  readCollection,
} from "../lib/database";
import { SavedPostType } from "../types/SavedPostType";
import { arrayToObject } from "../utilities/arrayToObject";

export const savedApi = createApi({
  reducerPath: "savedApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getSavedPosts: builder.query({
      queryFn: async (uid: string) => {
        try {
          const response = await readCollection<SavedPostType>(
            USERS,
            [["savedAt", "asc"]],
            [uid, SAVED]
          );
          const data = arrayToObject<SavedPostType>(response, "postID");
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
    addSavedPost: builder.mutation({
      queryFn: async ({ uid, post }: { uid: string; post: SavedPostType }) => {
        try {
          const response = await createDocument(
            USERS,
            post.postID,
            post,
            false,
            [uid, SAVED]
          );
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async ({ uid, post }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          const patchResult = dispatch(
            savedApi.util.updateQueryData("getSavedPosts", uid, (draft) => {
              if (draft) {
                Object.assign(draft, { [post.postID]: post });
              }
            })
          );
        } catch (error) {}
      },
    }),
    removeSavedPost: builder.mutation({
      queryFn: async ({ uid, postID }: { uid: string; postID: string }) => {
        try {
          const response = await deleteDocument(USERS, postID, [uid, SAVED]);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async ({ uid, postID }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          const patchResult = dispatch(
            savedApi.util.updateQueryData("getSavedPosts", uid, (draft) => {
              delete draft?.[postID];
            })
          );
        } catch (error) {}
      },
    }),
  }),
});

// hooks
export const {
  useLazyGetSavedPostsQuery,
  useGetSavedPostsQuery,
  useAddSavedPostMutation,
  useRemoveSavedPostMutation,
} = savedApi;
