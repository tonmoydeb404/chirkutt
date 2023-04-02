import { Helmet } from "react-helmet";
import { useReadNotificationsMutation } from "../api/notificationsApi";
import NotificationCard from "../common/components/NotificationCard";
import NotificationCardSkeleton from "../common/components/skeletons/NotificationCardSkeleton";
import { useAppContext } from "../common/layout/AppLayout";
import { usePrivateAuth } from "../common/outlet/PrivateOutlet";
import {
  NotificationDocumentType,
  NotificationType,
} from "../types/NotificationType";

const Notifications = () => {
  const auth = usePrivateAuth();
  const data = useAppContext();
  const [readNotifications] = useReadNotificationsMutation();

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
            {data.notifications.isSuccess && data.notificationUnread ? (
              <button
                className="btn btn-sm btn-theme"
                onClick={async () =>
                  await handleReadAllNotifications(
                    data.notifications?.data || {}
                  )
                }
              >
                mark all as read
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {data.notifications.isSuccess
            ? Object.keys(data.notifications.data).map((notifID) => {
                const notif = data.notifications.data?.[notifID];

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

          {data.notifications.isLoading || !data.notifications.data ? (
            <>
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
            </>
          ) : null}

          {data.notifications.isSuccess && !data.notifications.data
            ? "nothing here"
            : null}
          {data.notifications.isError ? "something wents to wrong" : null}
        </div>
      </div>
    </>
  );
};

export default Notifications;
