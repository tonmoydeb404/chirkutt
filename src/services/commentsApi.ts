import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { COMMENTS } from "../constants/firebase.constant";
import {
  createDocument,
  deleteMultiDocument,
  getCollection,
} from "../lib/database";
import { CommentType } from "../types/CommentType";
import { arrayToObject } from "../utilities/arrayToObject";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getAllComments: builder.query({
      queryFn: async () => {
        try {
          const response = await getCollection<CommentType>(COMMENTS);
          // sorting by time
          const sortedResponse = response.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
          const data = arrayToObject(sortedResponse, "id");
          return { data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (result) => {
        return result
          ? [
              ...Object.keys(result).map((id) => ({
                type: "Comment" as const,
                id,
              })),
              "Comment",
            ]
          : ["Comment"];
      },
    }),
    createComment: builder.mutation({
      queryFn: async (params: CommentType) => {
        try {
          const response = await createDocument(params.id, COMMENTS, params);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Comment"],
    }),
    deleteComment: builder.mutation({
      queryFn: async (idList: string[]) => {
        try {
          const response = await deleteMultiDocument(idList, COMMENTS);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Comment"],
    }),
  }),
});

// hooks
export const {
  useGetAllCommentsQuery,
  useLazyGetAllCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
