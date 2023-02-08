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
  tagTypes: ["Saved"],
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
      providesTags: (result) => {
        return result
          ? [
              ...Object.keys(result).map((id) => ({
                type: "Saved" as const,
                id,
              })),
              "Saved",
            ]
          : ["Saved"];
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
      invalidatesTags: ["Saved"],
    }),
    removeSavedPost: builder.mutation({
      queryFn: async ({ uid, id }: { uid: string; id: string }) => {
        try {
          const response = await deleteDocumentFields(uid, SAVED, [id]);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Saved"],
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
