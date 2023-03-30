import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { USERS } from "../constants/firebase.constant";
import { updateAuth, updateAuthPhoto } from "../lib/auth";
import {
  readCollectionRealtime,
  readDocument,
  updateDocument,
} from "../lib/database";
import { uploadImage } from "../lib/storage";
import { UserType } from "../types/UserType";
import { arrayToObject } from "../utilities/arrayToObject";
import { extractAuthUser } from "../utilities/extractAuthUser";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      queryFn: () => ({ data: {} }),
      onCacheEntryAdded: async (
        args,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          unsubscribe = readCollectionRealtime<UserType>(
            USERS,
            [["createdAt", "desc"]],
            (data) => {
              updateCachedData((draft) => {
                draft = arrayToObject<UserType>(data, "uid");
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
    getUser: builder.query({
      queryFn: async (uid: string) => {
        try {
          const response = await readDocument<UserType>(USERS, uid);

          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    updateAvatar: builder.mutation({
      queryFn: async ({ uid, file }: { uid: string; file: File }) => {
        try {
          // upload imgage and get download user
          const imageUrl = await uploadImage(`avatars/${uid}`, file);
          // update user document
          await updateDocument<UserType>(USERS, uid, {
            avatar: imageUrl,
          });
          // update user auth
          const authUser = await updateAuthPhoto(imageUrl);
          const updatedUser = extractAuthUser(authUser);
          if (!updatedUser) throw "user is not valid";

          return { data: { url: imageUrl, updatedUser } };
        } catch (error) {
          return { error };
        }
      },
    }),
    updateBio: builder.mutation({
      queryFn: async ({ uid, bio }: { uid: string; bio: string }) => {
        try {
          const response = await updateDocument<UserType>(USERS, uid, { bio });
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    updateName: builder.mutation({
      queryFn: async ({ uid, name }: { uid: string; name: string }) => {
        try {
          const documentResponse = await updateDocument<UserType>(USERS, uid, {
            name,
          });
          const authUser = await updateAuth({
            displayName: documentResponse.name,
          });
          return { data: extractAuthUser(authUser) };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

// hooks
export const {
  useGetUserQuery,
  useGetAllUsersQuery,
  useLazyGetUserQuery,
  useUpdateAvatarMutation,
  useUpdateBioMutation,
  useUpdateNameMutation,
} = usersApi;
