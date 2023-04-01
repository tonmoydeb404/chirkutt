import { ReactNode, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useLazyGetNotificationsQuery } from "../../api/notificationsApi";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";

import Appbar from "../components/layout/Appbar";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import PostModal from "../components/post/modal/PostModal";

type AppLayoutProps = {
  children?: ReactNode;
  sidebar: boolean;
};

const AppLayout = ({ children, sidebar }: AppLayoutProps) => {
  const auth = useAppSelector(selectAuth);
  const [getNotifications, allNotifications] = useLazyGetNotificationsQuery();

  // trigger get saved post
  useEffect(() => {
    const fetchSavedPost = async () => {
      if (auth && auth.status === "AUTHORIZED" && auth.user) {
        try {
          await getNotifications(auth.user.uid).unwrap();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchSavedPost();
  }, [auth]);

  // is all notifications are readed
  const isNotReaded = Boolean(
    allNotifications.isSuccess &&
      Object.keys(allNotifications.data).length &&
      Object.keys(allNotifications.data).some(
        (key) => allNotifications.data[key].status === "UNSEEN"
      )
  );

  return (
    <>
      <Navbar auth={auth} />
      <div className="container py-5 flex gap-3 md:gap-5 relative">
        <div className="flex-1">
          {children ? children : <Outlet context={auth} />}
        </div>
        {sidebar ? <Sidebar notifications={isNotReaded} auth={auth} /> : null}
      </div>
      <Appbar notifications={isNotReaded} auth={auth} />
      <PostModal />
    </>
  );
};

export default AppLayout;
