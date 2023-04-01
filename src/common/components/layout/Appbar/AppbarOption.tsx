import { Link } from "react-router-dom";
import iconList from "../../../../lib/iconList";
import { ListItemType } from "../../../../types/ListType";

const AppbarOption = ({
  item,
  onClick = () => {},
}: {
  item: ListItemType;
  onClick?: () => any;
}) => {
  return "path" in item ? (
    <Link
      key={item.title}
      onClick={onClick}
      to={item.path}
      className="appbar_option"
    >
      <span className="text-lg">{iconList[item.icon]}</span>
      <span>{item.title}</span>
    </Link>
  ) : (
    <button
      key={item.title}
      onClick={async () => {
        await item.action();
        await onClick();
      }}
      className="appbar_option"
    >
      <span className="text-lg">{iconList[item.icon]}</span>
      <span>{item.title}</span>
    </button>
  );
};

export default AppbarOption;
