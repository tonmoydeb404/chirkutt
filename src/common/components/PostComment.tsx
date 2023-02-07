import { formatDistanceToNow, parseISO } from "date-fns";
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { CommentType } from "../../types/CommentType";
import { UserType } from "../../types/UserType";
import ReplayForm from "./ReplayForm";

type PostCommentProps = {
  author: UserType;
  children?: ReactNode;
  replay: boolean;
  handleDeleteComment: (id: string) => Promise<void>;
  postAuthorUID: string;
} & CommentType;

const PostComment = ({
  author,
  id,
  children,
  postID,
  text,
  createdAt,
  replay = false,
  authorUID,
  postAuthorUID,
  handleDeleteComment,
}: PostCommentProps) => {
  const { user: authUser } = useAppSelector(selectAuth);
  const [showReplay, setShowReplay] = useState(false);

  return (
    <div className="comments_thread_wrapper" id={id}>
      <div className="flex flex-col gap-1 group">
        <div className="comments_thread ">
          <img src={author.avatar} alt={author.name} />
          <div className="comments_thread_body">
            <div className="flex justify-between items-center gap-1">
              <Link
                to={`/user/${author.username}`}
                className="comments_thread_title"
              >
                {author.name}
              </Link>
              <p className="comment_thread_date text-xs opacity-60">
                {formatDistanceToNow(
                  parseISO(new Date(createdAt).toISOString())
                )}{" "}
                ago
              </p>
            </div>
            <div className="flex gap-2">
              <p className="comments_thread_text mr-auto">{text}</p>
            </div>

            <div className="flex items-center gap-1 justify-end mt-1">
              {authUser &&
              (author.uid === authUser?.uid ||
                authUser.uid === postAuthorUID) ? (
                <button
                  className="btn btn-sm btn-theme comment_thread_delete_btn"
                  onClick={async () => await handleDeleteComment(id)}
                >
                  delete
                </button>
              ) : null}

              {replay && authUser ? (
                <button
                  className="btn btn-sm btn-theme comment_thread_replay_btn"
                  onClick={() => setShowReplay((prev) => !prev)}
                >
                  replay
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {children ? (
        <div className="comments_thread_replies">{children}</div>
      ) : null}

      {replay && showReplay ? (
        <ReplayForm
          postID={postID}
          parentID={id}
          commentAuthorUID={authorUID}
          postAuthorUID={postAuthorUID}
        />
      ) : null}
    </div>
  );
};

export default PostComment;
