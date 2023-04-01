import { useAppDispatch } from "../../../../app/hooks";
import { createPostModal } from "../../../../features/postModal/postModalSlice";
import { signout } from "../../../../lib/auth";
import { AuthType } from "../../../../types/AuthType";
import { ListItemType } from "../../../../types/ListType";
import AppbarIcon from "./AppbarIcon";
import AppbarMenu from "./AppbarMenu";

const Appbar = ({
  notifications,
  auth,
}: {
  notifications: boolean;
  auth: AuthType;
}) => {
  const dispatch = useAppDispatch();

  const authorizedLinks: ListItemType[] = [
    { title: "Home", path: "/", icon: "home" },
    {
      title: "Notifications",
      path: "/notifications",
      icon: "notification",
      badge: notifications ? "WARNING" : undefined,
    },
    {
      title: "New post",
      action: () => dispatch(createPostModal()),
      icon: "add",
    },
    { title: "Profile", path: "/profile", icon: "person" },
  ];

  const unauthorizedLinks: ListItemType[] = [
    { title: "Home", path: "/", icon: "home" },
    { title: "Sign up", path: "/signup", icon: "signup" },
    { title: "Sign in", path: "/signin", icon: "signin" },
  ];

  const authorizedDropdown: ListItemType[] = [
    { title: "Saved", path: "/saved", icon: "bookmarks" },
    { title: "Settings", path: "/settings", icon: "settings" },
    {
      title: "Sign Out",
      action: signout,
      icon: "signout",
    },
  ];

  const unauthorizedDropdown: ListItemType[] = [
    { title: "Sign up", path: "/signup", icon: "signup" },
    { title: "Sign in", path: "/signin", icon: "signin" },
  ];

  return (
    <div className="px-6 w-full fixed bottom-0 left-0 h-[55px] bg-white dark:bg-neutral-800 shadow border-t border-t-neutral-300 dark:border-t-neutral-700 min-[501px]:hidden min-[401px]:px-12 z-[1000]">
      <div className="flex items-center justify-between w-full h-full">
        {(auth.status === "AUTHORIZED"
          ? authorizedLinks
          : unauthorizedLinks
        ).map((link) => (
          <AppbarIcon item={link} key={link.title} />
        ))}
        <AppbarMenu
          list={
            auth.status === "AUTHORIZED"
              ? authorizedDropdown
              : unauthorizedDropdown
          }
        />
      </div>
    </div>
  );
};

export default Appbar;
