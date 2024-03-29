import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { POSTS } from "../constants/firebase.constant";
import {
  createDocument,
  deleteDocument,
  popField,
  pushField,
  readCollectionRealtime,
  readDocument,
  readDocumentRealtime,
  readQuery,
  updateDocument,
} from "../lib/database";
import { PostDocument, PostType } from "../types/PostType";
import { arrayToObject } from "../utilities/arrayToObject";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllPosts: builder.query<PostDocument, void>({
      queryFn: () => ({ data: {} as PostDocument }),
      onCacheEntryAdded: async (
        _args,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;

          unsubscribe = readCollectionRealtime<PostType>(
            POSTS,
            [["createdAt", "desc"]],
            (data) => {
              updateCachedData((draft) => {
                draft = arrayToObject<PostType>(data, "id");
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
    getPost: builder.query<PostType, string>({
      queryFn: async (id) => {
        try {
          const response = await readDocument<PostType>(POSTS, id);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      onCacheEntryAdded: async (
        id,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        try {
          await cacheDataLoaded;
          readDocumentRealtime<PostType>(id, POSTS, (data) => {
            updateCachedData((draft) => {
              draft = data;
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
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    searchPosts: builder.query({
      queryFn: async (query: string) => {
        try {
          const response = await readQuery<PostType>(
            POSTS,
            [{ key: "text", condition: ">=", value: query }],
            [["createdAt", "desc"]]
          );
          const data = arrayToObject(response, "id");
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
    likePost: builder.mutation({
      queryFn: async ({ id, uid }: { id: string; uid: string }) => {
        try {
          const response = await pushField<PostType>(POSTS, id, "likes", uid);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    dislikePost: builder.mutation({
      queryFn: async ({ id, uid }: { id: string; uid: string }) => {
        try {
          const response = await popField<PostType>(POSTS, id, "likes", uid);
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
  useGetAllPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useSearchPostsQuery,
  useLazySearchPostsQuery,
  useLikePostMutation,
  useDislikePostMutation,
  useLazyGetPostQuery,
} = postsApi;
