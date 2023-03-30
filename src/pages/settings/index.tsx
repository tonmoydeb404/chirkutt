import { Helmet } from "react-helmet";
import {
  BiImageAlt,
  BiLockAlt,
  BiRename,
  BiText,
  BiTrash,
} from "react-icons/bi";
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
          to="/settings/change-name"
          title="Change Name"
          icon={BiRename}
        />
        <SettingsCard
          to="/settings/change-avatar"
          title="Change Avatar"
          icon={BiImageAlt}
        />
        <SettingsCard
          to="/settings/change-bio"
          title="Change Bio"
          icon={BiText}
        />
        <SettingsCard
          to="/settings/change-password"
          title="Change Password"
          icon={BiLockAlt}
        />
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
