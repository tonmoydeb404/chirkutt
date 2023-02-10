import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { USERS } from "../constants/firebase.constant";
import { readCollection, readDocument, updateDocument } from "../lib/database";
import { UserType } from "../types/UserType";
import { arrayToObject } from "../utilities/arrayToObject";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      queryFn: async () => {
        try {
          const response = await readCollection<UserType>(USERS);
          const data = arrayToObject(response, "uid");
          return { data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (result) => {
        return result
          ? [
              ...Object.keys(result).map((id) => ({
                type: "User" as const,
                id,
              })),
              "User",
            ]
          : ["User"];
      },
    }),
    getUser: builder.query({
      queryFn: async (uid: string) => {
        try {
          const response = await readDocument<UserType>(USERS, uid);

          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["User"],
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
          const response = await updateDocument<UserType>(USERS, uid, updates);

          if (!response) throw "something went to wrong";

          return { data: response };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

// hooks
export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useGetAllUsersQuery,
  useLazyGetUserQuery,
} = usersApi;
