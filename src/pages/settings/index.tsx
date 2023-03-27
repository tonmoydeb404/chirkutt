import { Helmet } from "react-helmet";
import { BiEdit, BiImage, BiReset, BiTrash } from "react-icons/bi";
import SettingsCard from "../../common/components/SettingsCard";

const Settings = () => {
  return (
    <>
      <Helmet>
        <title>Settings - Chirkutt</title>
      </Helmet>

      <h3 className="text-lg font-medium mb-5">Settings</h3>

      <div className="flex flex-col gap-1.5">
        <SettingsCard
          to="/settings/avatar"
          title="Change Avatar"
          icon={BiImage}
        />
        <SettingsCard to="/settings/info" title="Edit Info" icon={BiEdit} />
        <SettingsCard to="/reset" title="Reset Password" icon={BiReset} />
        <SettingsCard
          to="#"
          title="Delete Account"
          icon={BiTrash}
          iconClass="text-red-600"
          titleClass="text-red-600"
        />
      </div>
    </>
  );
};

export default Settings;
