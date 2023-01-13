import { NavLink } from "react-router-dom";
import iconList from "../lib/iconList";
import { linkListLinkType } from "../types/ListType";

const mobileMenuLinks: linkListLinkType[] = [
  { title: "Home", path: "/", icon: "home" },
  { title: "Saved", path: "/saved", icon: "bookmarks" },
  { title: "New post", path: "/post/add", icon: "add" },
  { title: "Profile", path: "/profile", icon: "person" },
];

const MobileMenu = () => {
  return (
    <div className="px-6 w-full fixed bottom-0 left-0 h-[55px] bg-white dark:bg-neutral-800 shadow border-t border-t-neutral-300 dark:border-t-neutral-700 min-[501px]:hidden min-[401px]:px-12">
      <ul className="flex items-center justify-between w-full h-full">
        {mobileMenuLinks.map((link) => (
          <li className="inline-flex" key={link.path}>
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
        ))}

        <li className="inline-flex">
          <button className="inline-block text-2xl py-2 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded">
            {iconList.menu}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default MobileMenu;
