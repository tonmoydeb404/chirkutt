import { useEffect } from "react";
import { Helmet } from "react-helmet";
import NotificationCard from "../common/components/NotificationCard";
import NotificationCardSkeleton from "../common/components/skeletons/NotificationCardSkeleton";
import { usePrivateAuth } from "../common/outlet/PrivateOutlet";
import {
  useLazyGetNotificationsQuery,
  useReadNotificationsMutation,
} from "../services/notificationsApi";
import {
  NotificationDocumentType,
  NotificationType,
} from "../types/NotificationType";

const Notifications = () => {
  const auth = usePrivateAuth();
  const [getNotifications, allNotifications] = useLazyGetNotificationsQuery();
  const [readNotifications] = useReadNotificationsMutation();

  // trigger get saved post
  useEffect(() => {
    const fetchFn = async () => {
      if (auth && auth.status === "AUTHORIZED" && auth.user) {
        try {
          await getNotifications(auth.user.uid).unwrap();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchFn();
  }, [auth]);

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

  const isAllReaded = Object.keys(allNotifications?.data || {}).every(
    (key) => allNotifications?.data?.[key]?.status === "SEEN"
  );

  return (
    <>
      <Helmet>
        <title>Notifications - Chirkutt</title>
      </Helmet>
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
                  <NotificationCard
                    key={notif.id}
                    {...notif}
                    readNotif={async () => await handleReadNotificaton(notif)}
                  />
                );
              })
            : null}

          {allNotifications.isLoading || !allNotifications.data ? (
            <>
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
            </>
          ) : null}

          {allNotifications.isSuccess && !allNotifications.data
            ? "nothing here"
            : null}
          {allNotifications.isError ? "something wents to wrong" : null}
        </div>
      </div>
    </>
  );
};

export default Notifications;
