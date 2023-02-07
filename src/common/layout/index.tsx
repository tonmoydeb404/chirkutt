import { ReactNode, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { useLazyGetNotificationQuery } from "../../services/notificationsApi";
import PostForm from "../components/PostForm";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type propTypes = {
  children?: ReactNode;
  sidebar: boolean;
};

const Layout = ({ children, sidebar }: propTypes) => {
  const { user: authUser, status } = useAppSelector(selectAuth);
  const [getNotifications, allNotifications] = useLazyGetNotificationQuery();

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

  // is all notifications are readed
  const isAllReaded =
    allNotifications.isSuccess &&
    Object.keys(allNotifications.data).every(
      (key) => allNotifications.data[key].status === "SEEN"
    );

  return (
    <>
      <Navbar />
      <div className="container py-5 flex gap-3 md:gap-5">
        <div className="flex-1">{children ? children : <Outlet />}</div>
        {sidebar ? <Sidebar notifications={!isAllReaded} /> : null}
      </div>
      <MobileMenu notifications={!isAllReaded} />
      <Footer />
      <PostForm />
    </>
  );
};

export default Layout;
