import iconList from "../../../../lib/iconList";

type ProfileCardProps = {
  avatar: string;
  name: string;
  bio: string | null | undefined;
  email: string;
};

const ProfileCard = ({ avatar, name, bio, email }: ProfileCardProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-3 box p-3 sm:p-4 rounded">
      <div className="w-[70px]">
        <div className="aspect-w-1 aspect-h-1 w-full rounded overflow-hidden">
          <img src={avatar} alt={name} className="object-cover" />
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">{name}</h2>
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
