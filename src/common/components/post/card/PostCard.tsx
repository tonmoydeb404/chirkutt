import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../../app/hooks";
import { selectAuth } from "../../../../features/auth/authSlice";
import { PostDetails } from "../../../../types/PostType";
import PostCardActions from "./PostCardActions";
import PostCardFooter from "./PostCardFooter";

const PostCard = ({ content, author, comments, isSaved }: PostDetails) => {
  const { user: authUser } = useAppSelector(selectAuth);

  const isAuthorAuthorized = authUser?.uid === author.uid;

  return (
    <article className="flex flex-col p-3 box rounded shadow-sm">
      {/* header part */}
      <section className="flex items-center gap-2 mb-3">
        {/* author */}
        <div className="flex items-center gap-2">
          <Link to={`/user/${author.uid}`}>
            <img
              src={author.avatar}
              alt={author.name}
              className="w-[38px] rounded"
            />
          </Link>
          <div className="flex flex-col gap-0">
            <Link className="font-medium" to={`/user/${author.uid}`}>
              {author.name}
            </Link>
            <span className="text-xs inline-block opacity-70">
              {formatDistanceToNow(content.createdAt)} ago
            </span>
          </div>
        </div>
        {/* actions */}
        {isAuthorAuthorized ? <PostCardActions post={content} /> : null}
      </section>
      {/* body part */}
      <section className="flex flex-col">
        <p className="text-base whitespace-pre-line">{content.text}</p>
      </section>
      {/* footer part */}
      {!author.isDeleted ? (
        <PostCardFooter
          author={author}
          content={content}
          comments={comments}
          isSaved={isSaved}
        />
      ) : null}
    </article>
  );
};

export default PostCard;
