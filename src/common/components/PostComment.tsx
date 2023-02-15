import { formatDistanceToNow, parseISO } from "date-fns";
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { useDeleteCommentMutation } from "../../services/commentsApi";
import { useRemoveNotificationsMutation } from "../../services/notificationsApi";
import { CommentDetailsType, CommentType } from "../../types/CommentType";
import ReplayForm from "./ReplayForm";

type PostCommentProps = {
  postAuthorUID: string;
  replay: boolean;
  children?: ReactNode;
} & CommentDetailsType;

const PostComment = ({
  author,
  id,
  children,
  postID,
  text,
  createdAt,
  replay,
  authorUID,
  postAuthorUID,
  parentID,
}: PostCommentProps) => {
  const { user: authUser } = useAppSelector(selectAuth);
  const [showReplay, setShowReplay] = useState(false);
  const [deleteComment] = useDeleteCommentMutation();
  const [removeNotifications] = useRemoveNotificationsMutation();

  // handle delete
  const handleDeleteComment = async () => {
    const comment: CommentType = {
      id,
      text,
      authorUID,
      parentID,
      postID,
      createdAt,
    };
    try {
      const response = await deleteComment(comment).unwrap();
      // delete notifications too
      const deletedID = [];
      // current post notification
      if (comment.parentID === null && comment.authorUID !== postAuthorUID)
        deletedID.push(`${comment.postID}:${postAuthorUID}:${comment.id}`);

      if (response !== undefined) {
        response.forEach((item) => {
          if (item.authorUID !== comment.authorUID) {
            deletedID.push(`${item.postID}:${authorUID}:${item.id}`);
          }
          if (item.authorUID !== postAuthorUID) {
            deletedID.push(`${item.postID}:${postAuthorUID}:${item.id}`);
          }
        });
      }
      await removeNotifications(deletedID);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="comments_thread_wrapper" id={id}>
      <div className="flex flex-col gap-1 group">
        <div className="comments_thread ">
          <img src={author.avatar} alt={author.name} />
          <div className="comments_thread_body">
            <div className="flex justify-between items-center gap-1">
              <Link
                to={`/user/${author.uid}`}
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
                  onClick={handleDeleteComment}
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
