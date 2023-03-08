import { useAppDispatch } from "../../app/hooks";
import { openPostForm } from "../../features/postFormSlice";
import { signout } from "../../lib/auth";
import { AuthType } from "../../types/AuthType";
import { ListItemType } from "../../types/ListType";
import LinkList from "../components/List";
import UserCard from "../components/UserCard";

const SidebarSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex flex-col gap-3 md:gap-4 items-stretch w-full">
      <div className="h-[45px] md:h-[60px] box rounded p-0.5 md:p-2 flex items-stretch gap-2">
        <div className="w-full md:w-[45px] rounded-sm bg-neutral-200 dark:bg-white/5"></div>
        <div className=" flex-col gap-1.5 mt-1 md:flex hidden">
          <div className="self-stretch w-[100px] h-2 bg-neutral-200 dark:bg-white/5 rounded-sm"></div>
          <div className="self-stretch w-[60px] h-2 bg-neutral-200 dark:bg-white/5 rounded-sm"></div>
        </div>
      </div>
      <div className="h-[200px] box rounded p-2 flex flex-col gap-2"></div>
    </div>
  </div>
);

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
      action: () => dispatch(openPostForm({ type: "CREATE" })),
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
          <UserCard
            title={auth.user.name}
            uid={auth.user.uid}
            avatar={auth.user.avatar}
          />
          <LinkList items={authorizedLinks} />
        </>
      ) : auth?.status === "UNAUTHORIZED" ? (
        <LinkList items={unauthorizedLinks} />
      ) : (
        <SidebarSkeleton />
      )}
    </aside>
  );
};

export default Sidebar;
