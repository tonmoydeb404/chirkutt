import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { COMMENTS } from "../constants/firebase.constant";
import {
  createDocument,
  deleteDocument,
  deleteQuery,
  readCollection,
  readCollectionRealtime,
  readQuery,
  readQueryRealtime,
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
          const response = await readCollection<CommentType>(COMMENTS);
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

          unsubscribe = readCollectionRealtime<CommentType>(
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
    getPostComments: builder.query({
      queryFn: async (id: string) => {
        try {
          const response = await readQuery<CommentType>(COMMENTS, [
            { key: "postID", value: id, condition: "==" },
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
      onCacheEntryAdded: async (
        id: string,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;

          unsubscribe = readQueryRealtime<CommentType>(
            COMMENTS,
            [{ key: "postID", value: id, condition: "==" }],
            (response) => {
              updateCachedData((draft) => {
                // sorting by time
                const sortedResponse = response.sort((a, b) => {
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
          const response = await createDocument(COMMENTS, params.id, params);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    deleteComment: builder.mutation({
      queryFn: async (comment: CommentType) => {
        try {
          let response: CommentType[] = [];
          await deleteDocument(COMMENTS, comment.id);
          if (comment.parentID === null) {
            // delete replies also
            response = await deleteQuery<CommentType>(COMMENTS, [
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
          const response = await deleteQuery<CommentType>(COMMENTS, [
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
