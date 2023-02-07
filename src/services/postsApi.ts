import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { POSTS } from "../constants/firebase.constant";
import {
  createDocument,
  deleteDocument,
  getCollection,
  getCollectionRealtime,
  getQueryResult,
  updateDocument,
} from "../lib/database";
import { PostType } from "../types/PostType";
import { arrayToObject } from "../utilities/arrayToObject";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fakeBaseQuery(),
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
      onCacheEntryAdded: async (
        args,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        try {
          await cacheDataLoaded;

          const unsubscribe = getCollectionRealtime<PostType>(POSTS, (data) => {
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
          const response = await updateDocument<PostType>(id, POSTS, updates);

          if (!response) throw "something went to wrong";

          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      // invalidatesTags: ["Post"],
      onQueryStarted: async ({ id, updates }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const patchResult = dispatch(
            postsApi.util.updateQueryData("getAllPosts", {}, (draft) => {
              if (draft && draft[id] && data) {
                draft[id] = data;
              }
            })
          );
        } catch (error) {
          // console.log(error);
        }
      },
    }),
    searchPosts: builder.query({
      queryFn: async (query: string) => {
        try {
          const response = await getQueryResult<PostType>(
            [{ key: "text", condition: ">=", value: query }],
            POSTS
          );
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
