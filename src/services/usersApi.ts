import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { USERS } from "../constants/firebase.constant";
import {
    getCollection,
    getCollectionRealtime,
    getQueryResult,
    updateDocument,
} from "../lib/database";
import { UserType } from "../types/UserType";
import { arrayToObject } from "../utilities/arrayToObject";

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            queryFn: async () => {
                try {
                    const response = await getCollection<UserType>(USERS);
                    const data = arrayToObject(response, "uid");
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
                    unsubscribe = getCollectionRealtime<UserType>(
                        USERS,
                        (data) => {
                            updateCachedData(
                                (draft) =>
                                    (draft = arrayToObject<UserType>(
                                        data,
                                        "uid"
                                    ))
                            );
                        }
                    );
                } catch (error) {}
                await cacheEntryRemoved;
                unsubscribe();
            },
        }),
        getUser: builder.query({
            queryFn: async ({ username }: { username: string }) => {
                try {
                    const response = (await getQueryResult<UserType>(
                        [{ key: "username", value: username, condition: "==" }],
                        USERS
                    )) as UserType[];

                    if (!response.length) throw "user not found";

                    return { data: response[0] };
                } catch (error) {
                    return { error };
                }
            },
        }),
        updateUser: builder.mutation({
            queryFn: async ({
                uid,
                updates,
            }: {
                uid: string;
                updates: { [key: string]: any };
            }) => {
                try {
                    const response = (await updateDocument(
                        uid,
                        USERS,
                        updates
                    )) as UserType;

                    if (!response) throw "something went to wrong";

                    return { data: response };
                } catch (error) {
                    return { error };
                }
            },
        }),
    }),
});

// hooks
export const { useGetUserQuery, useUpdateUserMutation, useGetAllUsersQuery } =
    usersApi;
