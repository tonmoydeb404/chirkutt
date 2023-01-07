import { NavLink } from "react-router-dom";
import iconList from "../lib/iconList";
import { linkListPropsType } from "../types/linkList.type";

const LinkList = ({ links }: linkListPropsType) => {
  return links && links.length ? (
    <>
      <ul className="flex flex-col border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 p-1 md:p-2 rounded gap-0.5 shadow-sm">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `flex items-center justify-center md:justify-start gap-1.5 px-2 md:px-3 py-2 group hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded ${
                  isActive ? "bg-neutral-300 dark:bg-neutral-700" : ""
                } `
              }
            >
              {iconList[link.icon] ? (
                <span className="inline-block text-xl md:text-base">
                  {iconList[link.icon]}
                </span>
              ) : null}
              <span className="hidden md:inline-block font-medium text-sm tracking-wide">
                {link.title}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  ) : null;
};

export default LinkList;
