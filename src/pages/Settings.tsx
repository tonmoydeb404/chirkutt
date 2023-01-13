import InputGroup from "../common/components/Forms/InputGroup";
import TextGroup from "../common/components/Forms/TextGroup";
import iconList from "../common/lib/iconList";

const Settings = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Settings</h3>

        <div className="flex items-center gap-1">
          <button className="btn btn-sm btn-primary">
            save <span>{iconList.check}</span>
          </button>
          <button className="btn btn-sm btn-theme">cancel</button>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-10">
        <InputGroup label="Name" id="name" containerClass="max-w-full" />
        <InputGroup
          label="Username"
          id="username"
          containerClass="max-w-full"
        />
        <InputGroup label="Email" id="email" containerClass="max-w-full" />
        <TextGroup label="Bio" id="username" containerClass="max-w-full" />
      </div>
    </>
  );
};

export default Settings;
