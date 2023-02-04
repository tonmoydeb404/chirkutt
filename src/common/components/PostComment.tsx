import { formatDistanceToNow, parseISO } from "date-fns";
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import iconList from "../../lib/iconList";
import { CommentType } from "../../types/CommentType";
import { UserType } from "../../types/UserType";
import ReplayForm from "./ReplayForm";

type PostCommentProps = {
  author: UserType;
  children?: ReactNode;
  replay: boolean;
  handleDeleteComment: (id: string) => Promise<void>;
} & CommentType;

const PostComment = ({
  author,
  id,
  children,
  postID,
  text,
  createdAt,
  replay = false,
  handleDeleteComment,
}: PostCommentProps) => {
  const { user: authUser } = useAppSelector(selectAuth);
  const [showReplay, setShowReplay] = useState(false);

  return (
    <div className="comments_thread_wrapper">
      <div className="flex flex-col gap-1 group">
        <div className="comments_thread ">
          <img src={author.avatar} alt={author.name} />
          <div className="comments_thread_body">
            <div className="flex items-center gap-1">
              <Link
                to={`/user/${author.username}`}
                className="comments_thread_title"
              >
                {author.name}
              </Link>
              <div className="w-1 h-1 bg-secondary-200 rounded-full overflow-hidden"></div>
              <p className="comment_thread_date text-xs opacity-60">
                {formatDistanceToNow(
                  parseISO(new Date(createdAt).toISOString())
                )}{" "}
                ago
              </p>
            </div>
            <p className="comments_thread_text">{text}</p>
          </div>
          {authUser && author.uid === authUser?.uid ? (
            <button
              className="btn btn-error btn-icon btn-sm self-start invisible group-hover:visible"
              onClick={async () => await handleDeleteComment(id)}
            >
              {iconList.remove}
            </button>
          ) : null}
        </div>
        {replay ? (
          <button
            className="btn btn-sm btn-ghost self-end"
            onClick={() => setShowReplay((prev) => !prev)}
          >
            replay
          </button>
        ) : null}
      </div>

      {children ? (
        <div className="comments_thread_replies">{children}</div>
      ) : null}

      {replay && showReplay ? (
        <ReplayForm postID={postID} parentID={id} />
      ) : null}
    </div>
  );
};

export default PostComment;
