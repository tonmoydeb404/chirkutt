import { Link } from "react-router-dom";

type userCardType = {
  title: string;
  uid: string;
  avatar: string;
};

const UserCard = ({ title, uid, avatar }: userCardType) => {
  return (
    <div className="box flex items-center gap-2 p-0 md:p-2 rounded">
      <Link to={`/profile`} className="inline-block">
        <img
          src={avatar}
          alt={title}
          className="w-full md:w-[45px] inline-block rounded"
        />
      </Link>

      <div className="hidden md:flex flex-col gap-0">
        <Link to={`/profile`} className="text-lg font-semibold">
          {title}
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
