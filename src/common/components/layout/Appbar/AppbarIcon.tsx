import { NavLink } from "react-router-dom";
import iconList from "../../../../lib/iconList";
import { ListItemType } from "../../../../types/ListType";

const AppbarIcon = ({
  item,
  onClick = () => {},
}: {
  item: ListItemType;
  onClick?: () => any;
}) => {
  return "path" in item ? (
    <NavLink
      onClick={onClick}
      to={item.path}
      className={`appbar_icon`}
      title={item.title}
      data-badge={item.badge}
    >
      {iconList[item.icon]}
    </NavLink>
  ) : (
    <button
      className={`appbar_icon`}
      title={item.title}
      data-badge={item.badge}
      onClick={() => {
        item.action();
        onClick();
      }}
    >
      {iconList[item.icon]}
    </button>
  );
};

export default AppbarIcon;
