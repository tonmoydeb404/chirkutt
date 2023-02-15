import { NavLink } from "react-router-dom";
import iconList from "../../lib/iconList";
import type { ListPropsType } from "../../types/ListType";

const List = ({ items }: ListPropsType) => {
  return items && items.length ? (
    <>
      <ul className="box flex flex-col p-1 md:p-2 rounded gap-0.5">
        {items.map((item) => (
          <li
            key={item.title}
            // TODO: make badge classes
            className={
              item?.badge === "WARNING"
                ? "relative after:absolute after:top-5 after:left-2.5 after:w-2 after:h-2 after:rounded-full after:overflow-hidden after:bg-warning-400 after:animate-bounce"
                : ""
            }
          >
            {"path" in item ? (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start gap-1.5 px-2 md:px-3 py-2 group hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded ${
                    isActive ? "bg-neutral-300 dark:bg-neutral-700" : ""
                  } `
                }
              >
                <span className="inline-block text-xl md:text-base">
                  {iconList[item.icon]}
                </span>

                <span className="hidden md:inline-block font-medium text-sm tracking-wide">
                  {item.title}
                </span>
              </NavLink>
            ) : (
              <button
                onClick={item.action}
                className={`flex w-full items-center justify-center md:justify-start gap-1.5 px-2 md:px-3 py-2 group hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded  `}
              >
                <span className="inline-block text-xl md:text-base">
                  {iconList[item.icon]}
                </span>

                <span className="hidden md:inline-block font-medium text-sm tracking-wide">
                  {item.title}
                </span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  ) : null;
};

export default List;
