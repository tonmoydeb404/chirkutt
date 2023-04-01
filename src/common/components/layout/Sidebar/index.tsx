import { useAppDispatch } from "../../../../app/hooks";
import { createPostModal } from "../../../../features/postModal/postModalSlice";
import { signout } from "../../../../lib/auth";
import { AuthType } from "../../../../types/AuthType";
import { ListItemType } from "../../../../types/ListType";
import SidebarSkeleton from "../../skeletons/SidebarSkeleton";
import SidebarAuthor from "./SidebarAuthor";
import SidebarMenu from "./SidebarMenu";

const Sidebar = ({
  notifications,
  auth,
}: {
  notifications: boolean;
  auth: AuthType;
}) => {
  const dispatch = useAppDispatch();

  const authorizedLinks: ListItemType[] = [
    { title: "Home", path: "/", icon: "home" },
    { title: "Profile", path: "/profile", icon: "person" },
    {
      title: "New Post",
      action: () => dispatch(createPostModal()),
      icon: "add",
    },
    {
      title: "Notifications",
      path: "/notifications",
      icon: "notification",
      badge: notifications ? "WARNING" : undefined,
    },
    { title: "Saved", path: "/saved", icon: "bookmarks" },
    { title: "Settings", path: "/settings", icon: "settings" },
    { title: "Sign Out", action: signout, icon: "signout" },
  ];

  const unauthorizedLinks: ListItemType[] = [
    { title: "Home", path: "/", icon: "home" },
    { title: "Sign up", path: "/signup", icon: "signup" },
    { title: "Sign in", path: "/signin", icon: "signin" },
  ];

  return (
    <aside className="flex flex-col gap-3 md:gap-4 w-[50px] md:w-[220px] max-[500px]:hidden h-full sticky top-20">
      {auth?.status === "AUTHORIZED" && auth.user ? (
        <>
          <SidebarAuthor title={auth.user.name} avatar={auth.user.avatar} />
          <SidebarMenu items={authorizedLinks} />
        </>
      ) : auth?.status === "UNAUTHORIZED" ? (
        <SidebarMenu items={unauthorizedLinks} />
      ) : (
        <SidebarSkeleton />
      )}
    </aside>
  );
};

export default Sidebar;
