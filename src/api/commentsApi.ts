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
import { Comment } from "../types/CommentType";
import { arrayToObject } from "../utilities/arrayToObject";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllComments: builder.query({
      queryFn: async () => {
        try {
          const response = await readCollection<Comment>(COMMENTS);
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

          unsubscribe = readCollectionRealtime<Comment>(
            COMMENTS,
            [],
            (data) => {
              updateCachedData((draft) => {
                // sorting by time
                const sortedResponse = data.sort((a, b) => {
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                });
                draft = arrayToObject<Comment>(sortedResponse, "id");

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
    getPostComments: builder.query({
      queryFn: async (id: string) => {
        try {
          const response = await readQuery<Comment>(COMMENTS, [
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
