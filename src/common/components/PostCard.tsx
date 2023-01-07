import { formatDistanceToNow, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import iconList from "../lib/iconList";

type postPropsType = {
  id: string;
  text: string;
  createdAt: string;
  modifiedAt: string | null;
  likes: string[];
  author: { username: string; name: string; avatar: string };
};

const PostCard = ({
  id,
  text,
  createdAt,
  modifiedAt,
  likes,
  author,
}: postPropsType) => {
  return (
    <article className="flex flex-col p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded shadow-sm">
      {/* header part */}
      <section className="flex items-center gap-2 mb-3">
        {/* author */}
        <div className="flex items-center gap-2">
          <Link to={`/user/${author.username}`}>
            <img src={author.avatar} alt={author.name} className="w-[38px]" />
          </Link>
          <div className="flex flex-col gap-0">
            <Link className="font-medium" to={`/user/${author.username}`}>
              {author.name}
            </Link>
            <span className="text-xs inline-block opacity-70">
              {formatDistanceToNow(parseISO(createdAt))} ago
            </span>
          </div>
        </div>
        {/* actions */}
        <div className="flex items-center ml-auto gap-1">
          <label htmlFor="dropdown" className="dropdown relative">
            <input type="checkbox" className="peer hidden" id="dropdown" />
            <label
              htmlFor="dropdown"
              className="btn-icon btn-sm btn-ghost border-0 hover:bg-neutral-200 dark:hover:bg-neutral-700 bg-transparent dark:peer-checked:bg-neutral-700 peer-checked:bg-neutral-200 cursor-pointer"
            >
              {iconList.more}
            </label>

            <ul className="dropdown_menu absolute top-full right-0 min-w-[100px] bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-1 rounded shadow text-[15px] mt-1 peer-checked:flex hidden flex-col">
              <li className="px-2 py-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded">
                item 1
              </li>
              <li className="px-2 py-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded">
                item 2
              </li>
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
        <Link to={`/posts/${id}`} className="btn px-2 py-1.5 btn-theme">
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
  );
};

export default PostCard;