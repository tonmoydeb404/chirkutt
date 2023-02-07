import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import NotificationBox from "../common/components/NotificationBox";
import { selectAuth } from "../features/auth/authSlice";
import {
  useLazyGetNotificationQuery,
  useReadAllNotificationsMutation,
  useReadNotificationMutation,
} from "../services/notificationsApi";
import { NotificationType } from "../types/NotificationType";

const Notifications = () => {
  const { user: authUser, status } = useAppSelector(selectAuth);
  const [getNotifications, allNotifications] = useLazyGetNotificationQuery();
  const [readAllNotifications] = useReadAllNotificationsMutation();
  const [readNotifications] = useReadNotificationMutation();

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
  const handleReadAllNotif = async (notifs: {
    [key: string]: NotificationType;
  }) => {
    if (!authUser) return;
    try {
      const unreadNotifs = Object.keys(notifs).filter(
        (notifID) => notifs[notifID].status === "UNSEEN"
      );
      await readAllNotifications({
        uid: authUser.uid,
        idList: unreadNotifs,
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };
  // handle read notification
  const handleReadNotif = async (id: string) => {
    if (!authUser) return;
    try {
      await readNotifications({ uid: authUser.uid, id }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const allReaded =
    allNotifications.isSuccess &&
    Object.keys(allNotifications.data).every(
      (key) => allNotifications.data[key].status === "SEEN"
    );

  return (
    <div>
      <div className="flex items-center mb-5 justify-between">
        <h3 className="text-lg font-medium">Notifications</h3>

        <div className="flex items-center gap-1">
          {!allReaded && allNotifications.isSuccess ? (
            <button
              className="btn btn-sm btn-theme"
              onClick={async () =>
                await handleReadAllNotif(allNotifications?.data || {})
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
                  readNotif={async () => await handleReadNotif(notif.id)}
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
