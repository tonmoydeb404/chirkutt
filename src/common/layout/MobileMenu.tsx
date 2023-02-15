// TODO: organize codes
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { openPostForm } from "../../features/postFormSlice";
import { signout } from "../../lib/auth";
import iconList from "../../lib/iconList";
import { AuthType } from "../../types/AuthType";
import { ListItemType } from "../../types/ListType";

const MobileMenu = ({
  notifications,
  auth,
}: {
  notifications: boolean;
  auth: AuthType;
}) => {
  const dispatch = useAppDispatch();

  const authorizedLinks: ListItemType[] = [
    { title: "Home", path: "/", icon: "home" },
    { title: "Saved", path: "/saved", icon: "bookmarks" },
    {
      title: "New post",
      action: () => dispatch(openPostForm({ type: "CREATE" })),
      icon: "add",
    },
    {
      title: "Notifications",
      path: "/notifications",
      icon: "notification",
      badge: notifications ? "WARNING" : undefined,
    },
    { title: "Profile", path: "/profile", icon: "person" },
    { title: "Sign Out", action: signout, icon: "signout" },
  ];

  const unauthorizedLinks: ListItemType[] = [
    { title: "Home", path: "/", icon: "home" },
    { title: "Sign up", path: "/signup", icon: "signup" },
    { title: "Sign in", path: "/signin", icon: "signin" },
  ];

  return ["AUTHORIZED", "UNAUTHORIZED"].includes(auth?.status) ? (
    <div className="px-6 w-full fixed bottom-0 left-0 h-[55px] bg-white dark:bg-neutral-800 shadow border-t border-t-neutral-300 dark:border-t-neutral-700 min-[501px]:hidden min-[401px]:px-12">
      <ul className="flex items-center justify-between w-full h-full">
        {(auth?.user ? authorizedLinks : unauthorizedLinks).map((link) =>
          "path" in link ? (
            <li
              key={link.path} // TODO: make badge classes
              className={`inline-flex ${
                link?.badge === "WARNING"
                  ? "relative after:absolute after:top-5 after:left-2.5 after:w-2 after:h-2 after:rounded-full after:overflow-hidden after:bg-warning-400 after:animate-bounce"
                  : ""
              }`}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `inline-block text-2xl py-2 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded ${
                    isActive ? "bg-neutral-300 dark:bg-neutral-700" : ""
                  }`
                }
                title={link.title}
              >
                {iconList[link.icon]}
              </NavLink>
            </li>
          ) : (
            <li className="inline-flex" key={link.title}>
              <button
                className={`inline-block text-2xl py-2 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded`}
                title={link.title}
                onClick={link.action}
              >
                {iconList[link.icon]}
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  ) : null;
};

export default MobileMenu;
