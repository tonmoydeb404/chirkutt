import { BiCopyAlt } from "react-icons/bi";
import iconList from "../../lib/iconList";

type ProfileCardType = {
  avatar: string;
  name: string;
  bio: string | null | undefined;
  email: string;
};

const ProfileCard = ({ avatar, name, bio, email }: ProfileCardType) => {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-3 box p-3 sm:p-4 rounded">
      <img src={avatar} alt={name} className="w-[60px] rounded" />

      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">{name}</h2>
          <span>-</span>
          <span
            title="copy profile link"
            className="text-primary-600 text-sm hover:text-primary-700 cursor-copy"
          >
            <BiCopyAlt />
          </span>
        </div>
        {bio ? (
          <p className="text-sm w-full">{bio}</p>
        ) : (
          <span className="opacity-50 inline-flex gap-0.5 items-center text-xs">
            {iconList.pencil}
            edit your bio from settings
          </span>
        )}

        <div className="flex items-center gap-1 mt-3">
          <a
            href={`mailto:${email}`}
            target={"_blank"}
            className="btn btn-sm btn-theme ml-auto"
          >
            {iconList.email}
            email
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
