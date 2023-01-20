import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { POSTS } from "../constants/firebase.constant";
import {
    createDocument,
    getCollection,
    getCollectionRealtime,
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
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        );
                    });
                    const data = arrayToObject(sortedResponse, "id");
                    return { data };
                } catch (error) {
                    return { error };
                }
            },
            onCacheEntryAdded: async (
                arg,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) => {
                let unsubscribe = () => {};
                try {
                    await cacheDataLoaded;
                    unsubscribe = getCollectionRealtime<PostType>(
                        POSTS,
                        (data) => {
                            updateCachedData((draft) => {
                                // sorting by time
                                const sortedResponse = data.sort((a, b) => {
                                    return (
                                        new Date(b.createdAt).getTime() -
                                        new Date(a.createdAt).getTime()
                                    );
                                });
                                draft = arrayToObject<PostType>(
                                    sortedResponse,
                                    "id"
                                );
                            });
                        }
                    );
                } catch (error) {}
                await cacheEntryRemoved;
                unsubscribe();
            },
        }),
        createPost: builder.mutation({
            queryFn: async (params: PostType) => {
                try {
                    const response = await createDocument(
                        params.id,
                        POSTS,
                        params
                    );
                    return { data: response };
                } catch (error) {
                    return { error };
                }
            },
        }),
    }),
});

// hooks
export const { useGetAllPostsQuery, useCreatePostMutation } = postsApi;
