import { Link } from "react-router-dom";

type userCardType = {
  title: string;
  uid: string;
  avatar: string;
};

const UserCard = ({ title, uid, avatar }: userCardType) => {
  return (
    <div className="flex items-center gap-2 dark:bg-neutral-800 dark:border-neutral-700 p-0 md:p-2 border border-neutral-200 rounded shadow-sm">
      <Link to={`/user/${uid}`} className="inline-block">
        <img
          src={avatar}
          alt={title}
          className="w-full md:w-[45px] inline-block rounded"
        />
      </Link>

      <div className="hidden md:flex flex-col gap-0">
        <Link to={`/user/${uid}`} className="text-lg font-semibold">
          {title}
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
