import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { NOTIFICATIONS } from "../constants/firebase.constant";
import {
  createDocument,
  deleteDocuments,
  deleteQuery,
  readQuery,
  readQueryRealtime,
  updateDocuments,
} from "../lib/database";
import {
  NotificationDocumentType,
  NotificationType,
} from "../types/NotificationType";
import { arrayToObject } from "../utilities/arrayToObject";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationDocumentType, string>({
      queryFn: async (userID: string) => {
        try {
          const response = await readQuery<NotificationType>(NOTIFICATIONS, [
            { key: "userID", condition: "==", value: userID },
          ]);

          const sortedResponse = response.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });

          const data = arrayToObject<NotificationType>(sortedResponse, "id");

          return { data };
        } catch (error) {
          return { error };
        }
      },
      onCacheEntryAdded: async (
        userID,
        { updateCachedData, cacheEntryRemoved, cacheDataLoaded }
      ) => {
        let unsubscribe = () => {};
        try {
          await cacheDataLoaded;
          unsubscribe = readQueryRealtime<NotificationType>(
            NOTIFICATIONS,
            [{ key: "userID", condition: "==", value: userID }],
            (response) => {
              updateCachedData((draft) => {
                const sortedResponse = response.sort((a, b) => {
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                });

                draft = arrayToObject<NotificationType>(sortedResponse, "id");

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
      keepUnusedDataFor: 0,
    }),
    addNotification: builder.mutation({
      queryFn: async (notification: NotificationType) => {
        try {
          const response = await createDocument(
            NOTIFICATIONS,
            notification.id,
            notification
          );
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    removeNotifications: builder.mutation({
      queryFn: async (notificationID: string[]) => {
        try {
          const response = await deleteDocuments(NOTIFICATIONS, notificationID);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    readNotifications: builder.mutation({
      queryFn: async (notificationID: string[]) => {
        try {
          const response = await updateDocuments<NotificationType>(
            NOTIFICATIONS,
            notificationID,
            { status: "SEEN" }
          );
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    removePostNotifications: builder.mutation({
      queryFn: async (postID: string) => {
        try {
          const response = await deleteQuery<NotificationType>(NOTIFICATIONS, [
            { key: "id", condition: ">=", value: postID },
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
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useAddNotificationMutation,
  useRemoveNotificationsMutation,
  useReadNotificationsMutation,
  useRemovePostNotificationsMutation,
} = notificationsApi;
