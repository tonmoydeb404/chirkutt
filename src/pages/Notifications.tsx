import { useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  useLazyGetNotificationsQuery,
  useReadNotificationsMutation,
} from "../api/notificationsApi";
import NotificationCard from "../common/components/NotificationCard";
import NotificationCardSkeleton from "../common/components/skeletons/NotificationCardSkeleton";
import { usePrivateAuth } from "../common/outlet/PrivateOutlet";
import {
  NotificationDocumentType,
  NotificationType,
} from "../types/NotificationType";

const Notifications = () => {
  const auth = usePrivateAuth();
  const [readNotifications] = useReadNotificationsMutation();
  const [getNotifications, notifications] = useLazyGetNotificationsQuery();

  // trigger get notifications
  useEffect(() => {
    const fetchData = async () => {
      if (auth && auth.status === "AUTHORIZED" && auth.user) {
        try {
          await getNotifications(auth.user.uid).unwrap();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchData();
  }, [auth]);

  // is all notifications are readed
  const notificationUnread = Boolean(
    notifications.isSuccess &&
      Object.keys(notifications.data).length &&
      Object.keys(notifications.data).some(
        (key) => notifications.data[key].status === "UNSEEN"
      )
  );

  // handle read all notification
  const handleReadAllNotifications = async (
    notifications: NotificationDocumentType
  ) => {
    if (!auth?.user) return;
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
    if (!auth?.user || notification.status === "SEEN") return;
    try {
      await readNotifications([notification.id]).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Notifications - Chirkutt</title>
      </Helmet>
      <div>
        <div className="flex items-center mb-5 justify-between">
          <h3 className="text-lg font-medium">Notifications</h3>

          <div className="flex items-center gap-1">
            {notifications.isSuccess && notificationUnread ? (
              <button
                className="btn btn-sm btn-theme"
                onClick={async () =>
                  await handleReadAllNotifications(notifications?.data || {})
                }
              >
                mark all as read
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {notifications.isSuccess
            ? Object.keys(notifications.data).map((notifID) => {
                const notif = notifications.data?.[notifID];

                if (!notif) return null;

                return (
                  <NotificationCard
                    key={notif.id}
                    {...notif}
                    readNotif={async () => await handleReadNotificaton(notif)}
                  />
                );
              })
            : null}

          {notifications.isLoading || !notifications.data ? (
            <>
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
            </>
          ) : null}

          {notifications.isSuccess && !notifications.data
            ? "nothing here"
            : null}
          {notifications.isError ? "something wents to wrong" : null}
        </div>
      </div>
    </>
  );
};

export default Notifications;
