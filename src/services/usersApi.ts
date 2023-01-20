import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { USERS } from "../constants/firebase.constant";
import { getQueryResult, updateDocument } from "../lib/database";
import { UserType } from "../types/UserType";

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: fakeBaseQuery(),
    endpoints: (builder) => ({
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
export const { useGetUserQuery, useUpdateUserMutation } = usersApi;
