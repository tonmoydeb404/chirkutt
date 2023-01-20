import { formatDistanceToNow, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import iconList from "../../lib/iconList";
import { useGetAllUsersQuery } from "../../services/usersApi";
import { PostType } from "../../types/PostType";

const PostCard = ({
    id,
    text,
    createdAt,
    modifiedAt,
    likes,
    authorUID,
}: PostType) => {
    const { data, isLoading, isError, error, isSuccess } = useGetAllUsersQuery(
        {}
    );
    // success state
    if (data && isSuccess && Object.keys(data).length) {
        const author = data[authorUID];

        return author ? (
            <article className="flex flex-col p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded shadow-sm">
                {/* header part */}
                <section className="flex items-center gap-2 mb-3">
                    {/* author */}
                    <div className="flex items-center gap-2">
                        <Link to={`/user/${author.username}`}>
                            <img
                                src={author.avatar}
                                alt={author.name}
                                className="w-[38px]"
                            />
                        </Link>
                        <div className="flex flex-col gap-0">
                            <Link
                                className="font-medium"
                                to={`/user/${author.username}`}
                            >
                                {author.name}
                            </Link>
                            <span className="text-xs inline-block opacity-70">
                                {formatDistanceToNow(parseISO(createdAt))} ago
                            </span>
                        </div>
                    </div>
                    {/* actions */}
                    <div className="flex items-center ml-auto gap-1">
                        <label className="dropdown">
                            <input type="checkbox" id="dropdown" />
                            <label
                                htmlFor="dropdown"
                                className="btn-icon btn-sm btn-ghost"
                            >
                                {iconList.more}
                            </label>

                            <ul>
                                <li>item 1</li>
                                <li>item 2</li>
                            </ul>
                        </label>
                    </div>
                </section>
                {/* body part */}
                <section className="flex flex-col mb-3">
                    <p className="text-base">{text}</p>
                </section>
                {/* footer part */}
                <section className="flex items-center gap-1">
                    <button className="btn px-2 py-1.5 btn-theme">
                        {likes.length}
                        <span className="text-base">{iconList.like}</span>
                    </button>
                    <Link
                        to={`/post/${id}`}
                        className="btn px-2 py-1.5 btn-theme"
                    >
                        01
                        <span className="text-base">{iconList.comment}</span>
                    </Link>

                    <button className="btn-icon btn-sm btn-theme ml-auto">
                        {iconList.share}
                    </button>
                    <button className="btn-icon btn-theme btn-sm">
                        {iconList.add_bookmark}
                    </button>
                </section>
            </article>
        ) : null;
    }

    // error state
    if (!data && isError) {
        return <p>something wents to wrong</p>;
    }

    // loading state
    return <p>loading</p>;
};

export default PostCard;
