import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import NotificationBox from "../common/components/NotificationBox";
import { selectAuth } from "../features/auth/authSlice";
import {
  useLazyGetNotificationsQuery,
  useReadNotificationsMutation,
} from "../services/notificationsApi";
import {
  NotificationDocumentType,
  NotificationType,
} from "../types/NotificationType";

const Notifications = () => {
  const { user: authUser, status } = useAppSelector(selectAuth);
  const [getNotifications, allNotifications] = useLazyGetNotificationsQuery();
  const [readNotifications] = useReadNotificationsMutation();

  // trigger get saved post
  useEffect(() => {
    const fetchSavedPost = async () => {
      if (status === "AUTHORIZED" && authUser) {
        try {
          await getNotifications(authUser.uid).unwrap();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchSavedPost();
  }, [authUser, status]);

  // handle read all notification
  const handleReadAllNotifications = async (
    notifications: NotificationDocumentType
  ) => {
    if (!authUser) return;
    try {
      const unreadNotifications = Object.keys(notifications).filter(
        (id) => notifications[id].status === "UNSEEN"
      );
      await readNotifications(unreadNotifications).unwrap();
    } catch (error) {
      console.log(error);
    }
  };
  // handle read notification
  const handleReadNotificaton = async (notification: NotificationType) => {
    if (!authUser || notification.status === "SEEN") return;
    try {
      await readNotifications([notification.id]).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const isAllReaded = Object.keys(allNotifications?.data || {}).every(
    (key) => allNotifications?.data?.[key]?.status === "SEEN"
  );

  return (
    <div>
      <div className="flex items-center mb-5 justify-between">
        <h3 className="text-lg font-medium">Notifications</h3>

        <div className="flex items-center gap-1">
          {allNotifications.isSuccess && !isAllReaded ? (
            <button
              className="btn btn-sm btn-theme"
              onClick={async () =>
                await handleReadAllNotifications(allNotifications?.data || {})
              }
            >
              mark all as read
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {allNotifications.isSuccess
          ? Object.keys(allNotifications.data).map((notifID) => {
              const notif = allNotifications.data?.[notifID];

              if (!notif) return null;

              return (
                <NotificationBox
                  key={notif.id}
                  {...notif}
                  readNotif={async () => await handleReadNotificaton(notif)}
                />
              );
            })
          : null}

        {allNotifications.isLoading ? "loading..." : null}
        {allNotifications.isSuccess &&
        !Object.keys(allNotifications.data).length
          ? "nothing here"
          : null}
        {allNotifications.isError ? "something wents to wrong" : null}
      </div>
    </div>
  );
};

export default Notifications;
