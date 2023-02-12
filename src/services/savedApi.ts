import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { SAVED } from "../constants/firebase.constant";
import {
  createDocument,
  deleteDocumentFields,
  readDocument,
} from "../lib/database";
import { SavedPostType } from "../types/SavedPostType";
import { arrayToObject } from "../utilities/arrayToObject";
import { objectToArray } from "../utilities/objectToArray";

type SavedPostDocument = { [key: string]: SavedPostType };

export const savedApi = createApi({
  reducerPath: "savedApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getSavedPosts: builder.query({
      queryFn: async (uid: string) => {
        try {
          const response = await readDocument<SavedPostDocument>(
            SAVED,
            uid,
            true
          );

          // sort object
          const sortedResponseArr = objectToArray<SavedPostType>(response).sort(
            (a, b) => {
              return (
                new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
              );
            }
          );

          const data = arrayToObject<SavedPostType>(
            sortedResponseArr,
            "postID"
          );

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
            SAVED,
            uid,
            {
              [post.postID]: post,
            },
            true
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
      queryFn: async ({ uid, id }: { uid: string; id: string }) => {
        try {
          const response = await deleteDocumentFields(SAVED, uid, [id]);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async ({ uid, id }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          const patchResult = dispatch(
            savedApi.util.updateQueryData("getSavedPosts", uid, (draft) => {
              delete draft?.[id];
            })
          );
        } catch (error) {}
      },
    }),
    clearSavedPost: builder.mutation({
      queryFn: async ({ uid }: { uid: string }) => {
        try {
          const response = await createDocument(SAVED, uid, {});
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async ({ uid }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          const patchResult = dispatch(savedApi.util.resetApiState());
        } catch (error) {
          console.log(error);
        }
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
  useClearSavedPostMutation,
} = savedApi;
