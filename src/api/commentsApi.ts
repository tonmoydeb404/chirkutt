import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { COMMENTS } from "../constants/firebase.constant";
import {
  createDocument,
  deleteDocument,
  deleteQuery,
  readCollectionRealtime,
  readQuery,
  readQueryRealtime,
} from "../lib/database";
import { Comment, CommentDocument } from "../types/CommentType";
import { arrayToObject } from "../utilities/arrayToObject";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllComments: builder.query({
      queryFn: async () => ({ data: {} as CommentDocument }),
      onCacheEntryAdded: async (
        _args,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        try {
          await cacheDataLoaded;
          readCollectionRealtime<Comment>(
            COMMENTS,
            [["createdAt", "asc"]],
            (data) => {
              updateCachedData((draft) => {
                draft = arrayToObject<Comment>(data, "id");
                return draft;
              });
            }
          );
        } catch (error) {
          console.log(error);
        }

        await cacheEntryRemoved;
      },
    }),
    getPostComments: builder.query({
      queryFn: async (id: string) => {
        try {
          const response = await readQuery<Comment>(
            COMMENTS,
            [{ key: "postID", value: id, condition: "==" }],
            [["createdAt", "asc"]]
          );
          const data = arrayToObject(response, "id");
          return { data };
        } catch (error) {
          return { error };
        }
      },
      onCacheEntryAdded: async (
        id: string,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;

          unsubscribe = readQueryRealtime<Comment>(
            COMMENTS,
            [{ key: "postID", value: id, condition: "==" }],
            [["createdAt", "asc"]],
            (response) => {
              updateCachedData((draft) => {
                draft = arrayToObject<Comment>(response, "id");

                return draft;
              });
            }
          );
        } catch (error) {
          console.log(error);
        }

        await cacheEntryRemoved;
        unsubscribe();
      },
    }),
    createComment: builder.mutation({
      queryFn: async (params: Comment) => {
        try {
          const response = await createDocument(COMMENTS, params.id, params);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    deleteComment: builder.mutation({
      queryFn: async (comment: Comment) => {
        try {
          let response: Comment[] = [];
          await deleteDocument(COMMENTS, comment.id);
          if (comment.parentID === null) {
            // delete replies also
            response = await deleteQuery<Comment>(COMMENTS, [
              { key: "parentID", condition: "==", value: comment.id },
            ]);
          }

          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    deleteReplies: builder.mutation({
      queryFn: async (parentID: string) => {
        try {
          const response = await deleteQuery<Comment>(COMMENTS, [
            { key: "parentID", condition: "==", value: parentID },
          ]);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

// hooks
export const {
  useGetAllCommentsQuery,
  useLazyGetAllCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useDeleteRepliesMutation,
  useGetPostCommentsQuery,
  useLazyGetPostCommentsQuery,
} = commentsApi;
