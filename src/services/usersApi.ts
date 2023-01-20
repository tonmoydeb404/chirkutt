import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { USERS } from "../constants/firebase.constant";
import { getQueryResult } from "../lib/database";
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
    }),
});

// hooks
export const { useGetUserQuery } = usersApi;
