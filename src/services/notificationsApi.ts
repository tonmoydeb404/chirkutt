import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { NOTIFICATIONS } from "../constants/firebase.constant";
import {
  createDocument,
  deleteDocumentFields,
  getDocument,
  getDocumentRealtime,
  updateFields,
} from "../lib/database";
import { NotificationType } from "../types/NotificationType";
import { arrayToObject } from "../utilities/arrayToObject";
import { objectToArray } from "../utilities/objectToArray";

type NotificationDocument = { [key: string]: NotificationType };

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({
    getNotification: builder.query({
      queryFn: async (uiid: string) => {
        try {
          const response = await getDocument<NotificationDocument>(
            uiid,
            NOTIFICATIONS
          );

          // sort object
          const sortedResponseArr = objectToArray<NotificationType>(
            response
          ).sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });

          const data = arrayToObject<NotificationType>(sortedResponseArr, "id");

          return { data };
        } catch (error) {
          return { error };
        }
      },
      onCacheEntryAdded: async (
        uiid,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        try {
          await cacheDataLoaded;

          const unsubscribe = getDocumentRealtime<NotificationDocument>(
            uiid,
            NOTIFICATIONS,
            (data) => {
              updateCachedData((draft) => {
                const sortedResponseArr = objectToArray<NotificationType>(
                  data
                ).sort((a, b) => {
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                });

                draft = arrayToObject<NotificationType>(
                  sortedResponseArr,
                  "id"
                );

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
    addNotification: builder.mutation({
      queryFn: async ({
        uid,
        notification,
      }: {
        uid: string;
        notification: NotificationType;
      }) => {
        try {
          const response = await createDocument(
            uid,
            NOTIFICATIONS,
            {
              [notification.id]: notification,
            },
            true
          );
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    removeNotification: builder.mutation({
      queryFn: async ({ uid, id }: { uid: string; id: string }) => {
        try {
          const response = await deleteDocumentFields(uid, NOTIFICATIONS, [id]);
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    removeMultiNotification: builder.mutation({
      queryFn: async ({ uid, idList }: { uid: string; idList: string[] }) => {
        try {
          const response = await deleteDocumentFields(
            uid,
            NOTIFICATIONS,
            idList
          );
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    readNotification: builder.mutation({
      queryFn: async ({ uid, id }: { uid: string; id: string }) => {
        try {
          const response = await updateFields<NotificationType>(
            uid,
            NOTIFICATIONS,
            [id],
            { status: "SEEN" }
          );
          return { data: response };
        } catch (error) {
          return { error };
        }
      },
    }),
    readAllNotifications: builder.mutation({
      queryFn: async ({ uid, idList }: { uid: string; idList: string[] }) => {
        try {
          const response = await updateFields<NotificationType>(
            uid,
            NOTIFICATIONS,
            idList,
            { status: "SEEN" }
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
export const {
  useGetNotificationQuery,
  useLazyGetNotificationQuery,
  useAddNotificationMutation,
  useRemoveNotificationMutation,
  useRemoveMultiNotificationMutation,
  useReadAllNotificationsMutation,
  useReadNotificationMutation,
} = notificationsApi;
