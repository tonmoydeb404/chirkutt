import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import iconList from "../../../lib/iconList";

type SettingsHeaderProps = {
  title: string;
  allowText?: string;
  denyText?: string;
  allow: boolean;
};

const SettingsHeader = ({
  allow,
  allowText = "save",
  denyText = "cancel",
  title,
}: SettingsHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center mb-5 gap-2">
      <button
        onClick={() => navigate(-1)}
        className="text-primary-600"
        type="button"
      >
        <BiArrowBack />
      </button>
      <h3 className="text-lg font-medium">{title}</h3>

      <div className="flex items-center gap-1 ml-auto">
        {allow ? (
          <button className="btn btn-sm btn-primary" type="submit">
            {allowText} <span>{iconList.check}</span>
          </button>
        ) : null}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-sm btn-theme"
          type="button"
        >
          {denyText}
        </button>
      </div>
    </div>
  );
};

export default SettingsHeader;
