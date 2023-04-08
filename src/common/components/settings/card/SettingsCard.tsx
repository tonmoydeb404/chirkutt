import { IconType } from "react-icons";
import { Link } from "react-router-dom";

type SettingsCardType = {
  to: string;
  icon: IconType;
  title: string;
  iconClass?: string;
  titleClass?: string;
  wrapperClass?: string;
  onClick?: () => void;
};

const SettingsCard = ({
  to,
  title,
  icon: Icon,
  iconClass = "",
  titleClass = "",
  wrapperClass = "",
  onClick = () => {},
}: SettingsCardType) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center py-3 px-3 box rounded gap-3 group duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 ${wrapperClass}`}
    >
      <span className={`text-2xl text-primary-600 ${iconClass}`}>
        <Icon />
      </span>

      <h2 className={`text-base font-medium ${titleClass}`}>{title}</h2>
    </Link>
  );
};

export default SettingsCard;
