// TODO: organize codes
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { createPostModal } from "../../features/postModal/postModalSlice";
import iconList from "../../lib/iconList";
import { AuthType } from "../../types/AuthType";
import { ListItemType } from "../../types/ListType";

import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { authSignOut } from "../../features/auth/authSlice";

function DropDownMenu({ list }: { list: ListItemType[] }) {
  return (
    <Popover as="div">
      <Popover.Button
        className={`inline-block text-2xl py-2 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded`}
      >
        {iconList.menu}
      </Popover.Button>
      <Popover.Overlay className="fixed inset-0 bg-black opacity-40" />
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel className="absolute z-10 bottom-full mb-0 w-full left-0 right-0">
          {({ close }) => (
            <div className="flex flex-col box px-2 py-4 gap-1">
              {list.map((link) =>
                "path" in link ? (
                  <Link
                    key={link.title}
                    onClick={() => close()}
                    to={link.path}
                    className="px-3 py-2 border border-neutral-700 rounded flex items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    <span className="text-lg">{iconList[link.icon]}</span>
                    <span>{link.title}</span>
                  </Link>
                ) : (
                  <button
                    key={link.title}
                    onClick={() => {
                      close();
                      link.action();
                    }}
                    className="w-full px-3 py-2 border border-neutral-700 rounded flex items-center gap-1 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    <span className="text-lg">{iconList[link.icon]}</span>
                    <span>{link.title}</span>
                  </button>
                )
              )}
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

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
      action: () => dispatch(authSignOut()),
      icon: "signout",
    },
  ];

  const unauthorizedDropdown: ListItemType[] = [
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
        <DropDownMenu
          list={auth?.user ? authorizedDropdown : unauthorizedDropdown}
        />
      </ul>
    </div>
  ) : null;
};

export default MobileMenu;
