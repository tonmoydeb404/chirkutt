import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { POSTS } from "../constants/firebase.constant";
import {
  createDocument,
  deleteDocument,
  getCollection,
  updateDocument,
} from "../lib/database";
import { PostType } from "../types/PostType";
import { arrayToObject } from "../utilities/arrayToObject";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getAllPosts: builder.query({
      queryFn: async () => {
        try {
          const response = await getCollection<PostType>(POSTS);
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
                type: "Post" as const,
                id,
              })),
              "Post",
            ]
          : ["Post"];
      },
    }),
    createPost: builder.mutation({
      queryFn: async (params: PostType) => {
        try {
          const response = await createDocument(params.id, POSTS, params);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      queryFn: async (id: string) => {
        try {
          const response = await deleteDocument(id, POSTS);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation({
      queryFn: async ({
        id,
        updates,
      }: {
        id: string;
        updates: { [key: string]: any };
      }) => {
        try {
          const response = await updateDocument<PostType>(id, POSTS, updates);

          if (!response) throw "something went to wrong";

          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Post"],
    }),
  }),
});

// hooks
export const {
  useGetAllPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} = postsApi;
