import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { POSTS } from "../constants/firebase.constant";
import {
  createDocument,
  deleteDocument,
  readCollectionRealtime,
  readQuery,
  updateDocument,
} from "../lib/database";
import { PostDocumentType, PostType } from "../types/PostType";
import { arrayToObject } from "../utilities/arrayToObject";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllPosts: builder.query<PostDocumentType, void>({
      queryFn: () => ({ data: {} }),
      onCacheEntryAdded: async (
        args,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;

          unsubscribe = readCollectionRealtime<PostType>(POSTS, (data) => {
            updateCachedData((draft) => {
              // sorting by time
              const sortedResponse = data.sort((a, b) => {
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              });
              draft = arrayToObject<PostType>(sortedResponse, "id");
              return draft;
            });
          });
        } catch (error) {
          console.log(error);
        }

        await cacheEntryRemoved;
        unsubscribe();
      },
    }),
    createPost: builder.mutation({
      queryFn: async (params: PostType) => {
        try {
          const response = await createDocument(POSTS, params.id, params);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    deletePost: builder.mutation({
      queryFn: async (id: string) => {
        try {
          const response = await deleteDocument(POSTS, id);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    updatePost: builder.mutation({
      queryFn: async ({
        id,
        updates,
      }: {
        id: string;
        updates: Partial<PostType>;
      }) => {
        try {
          const response = await updateDocument<PostType>(POSTS, id, updates);

          if (!response) throw "something went to wrong";

          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    searchPosts: builder.query({
      queryFn: async (query: string) => {
        try {
          const response = await readQuery<PostType>(POSTS, [
            { key: "text", condition: ">=", value: query },
          ]);
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
    }),
  }),
});

// hooks
export const {
  useGetAllPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useSearchPostsQuery,
  useLazySearchPostsQuery,
} = postsApi;
