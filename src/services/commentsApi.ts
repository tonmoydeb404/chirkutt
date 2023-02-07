import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { COMMENTS } from "../constants/firebase.constant";
import {
  createDocument,
  deleteMultiDocument,
  getCollection,
  getCollectionRealtime,
  getQueryResult,
  getQueryResultRealtime,
} from "../lib/database";
import { CommentType } from "../types/CommentType";
import { arrayToObject } from "../utilities/arrayToObject";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fakeBaseQuery(),
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
      onCacheEntryAdded: async (
        args,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;

          unsubscribe = getCollectionRealtime<CommentType>(COMMENTS, (data) => {
            updateCachedData((draft) => {
              // sorting by time
              const sortedResponse = data.sort((a, b) => {
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              });
              draft = arrayToObject<CommentType>(sortedResponse, "id");

              return draft;
            });
          });
        } catch (error) {
          console.log(error);
        }

        await cacheEntryRemoved;
      },
    }),
    getPostComments: builder.query({
      queryFn: async (id: string) => {
        try {
          const response = await getQueryResult<CommentType>(
            [{ key: "postID", value: id, condition: "==" }],
            COMMENTS
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
      onCacheEntryAdded: async (
        id: string,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;

          unsubscribe = getQueryResultRealtime<CommentType>(
            [{ key: "postID", value: id, condition: "==" }],
            COMMENTS,
            (data) => {
              updateCachedData((draft) => {
                // sorting by time
                const sortedResponse = data.sort((a, b) => {
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                });

                draft = arrayToObject<CommentType>(sortedResponse, "id");

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
    createComment: builder.mutation({
      queryFn: async (params: CommentType) => {
        try {
          const response = await createDocument(params.id, COMMENTS, params);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    deleteComment: builder.mutation({
      queryFn: async (idList: string[]) => {
        try {
          const response = await deleteMultiDocument(idList, COMMENTS);
          // console.log(response);

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
  useGetPostCommentsQuery,
  useLazyGetPostCommentsQuery,
} = commentsApi;
