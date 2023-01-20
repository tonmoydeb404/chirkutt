import { Link } from "react-router-dom";

type userCardType = {
    title: string;
    username: string;
    avatar: string;
};

const UserCard = ({ title, username, avatar }: userCardType) => {
    return (
        <div className="flex items-center gap-2 dark:bg-neutral-800 dark:border-neutral-700 p-0 md:p-2 border border-neutral-200 rounded shadow-sm">
            <Link to={`/user/${username}`} className="inline-block">
                <img
                    src={avatar}
                    alt={title}
                    className="w-full md:w-[45px] inline-block rounded"
                />
            </Link>

            <div className="hidden md:flex flex-col gap-0">
                <Link
                    to={`/user/${username}`}
                    className="text-lg font-semibold"
                >
                    {title}
                </Link>
                <Link
                    to={`/user/${username}`}
                    className="text-xs tracking-wide"
                >
                    @{username}
                </Link>
            </div>
        </div>
    );
};

export default UserCard;
