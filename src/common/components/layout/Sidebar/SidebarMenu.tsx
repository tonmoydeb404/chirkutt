import { NavLink } from "react-router-dom";
import iconList from "../../../../lib/iconList";
import type { ListPropsType } from "../../../../types/ListType";

const SidebarMenu = ({ items }: ListPropsType) => {
  return items && items.length ? (
    <>
      <ul className="box flex flex-col p-1 md:p-2 rounded gap-0.5">
        {items.map((item) =>
          "path" in item ? (
            <NavLink
              to={item.path}
              className="sidebar_menu_item"
              end
              data-badge={item.badge}
              key={item.title}
            >
              <span className="sidebar_menu_item-icon">
                {iconList[item.icon]}
              </span>
              <span className="sidebar_menu_item-title">{item.title}</span>
            </NavLink>
          ) : (
            <button
              key={item.title}
              onClick={item.action}
              className={`sidebar_menu_item`}
              data-badge={item.badge}
            >
              <span className="sidebar_menu_item-icon">
                {iconList[item.icon]}
              </span>
              <span className="sidebar_menu_item-title">{item.title}</span>
            </button>
          )
        )}
      </ul>
    </>
  ) : null;
};

export default SidebarMenu;
