import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useDeleteCommentMutation } from "../../../api/commentsApi";
import { useRemoveNotificationsMutation } from "../../../api/notificationsApi";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/authSlice";
import { Comment, CommentDetails } from "../../../types/CommentType";

type CommentReplyCardProps = {
  postAuthorUID: string;
} & CommentDetails;

const CommentReplyCard = ({
  author,
  comment,
  postAuthorUID,
}: CommentReplyCardProps) => {
  const { user: authUser } = useAppSelector(selectAuth);
  const [deleteComment] = useDeleteCommentMutation();
  const [removeNotifications] = useRemoveNotificationsMutation();

  // delete notifications that linked with the comment
  const handleReplyNotifications = async (comments: Comment[]) => {
    const deletedID = [];
    // current comment notification
    if (comment.authorUID !== postAuthorUID)
      deletedID.push(`${comment.postID}:${postAuthorUID}:${comment.id}`);

    comments.forEach((item) => {
      // avoid comment author replies
      if (item.authorUID !== comment.authorUID) {
        deletedID.push(`${item.postID}:${comment.authorUID}:${item.id}`);
      }
      // avoid post author replies
      if (item.authorUID !== postAuthorUID) {
        deletedID.push(`${item.postID}:${postAuthorUID}:${item.id}`);
      }
    });

    await removeNotifications(deletedID);
  };

  // handle delete
  const handleDeleteReply = async () => {
    try {
      const response = await deleteComment(comment).unwrap();
      if (!response) throw new Error("cannot delete comment");
      await handleReplyNotifications(response);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="comments_thread ">
      <img src={author.avatar} alt={author.name} />
      <div className="comments_thread_body">
        <div className="flex justify-between items-center gap-1">
          <Link to={`/user/${author.uid}`} className="comments_thread_title">
            {author.name}
          </Link>
          <p className="comment_thread_date text-xs opacity-60">
            {formatDistanceToNow(comment.createdAt)}&nbsp;ago
          </p>
        </div>
        <div className="flex gap-2">
          <p className="comments_thread_text mr-auto">{comment.text}</p>
        </div>

        <div className="flex items-center gap-1 justify-end mt-1">
          {authUser &&
          (author.uid === authUser?.uid || authUser.uid === postAuthorUID) ? (
            <button
              className="btn btn-sm btn-theme comment_thread_delete_btn"
              onClick={handleDeleteReply}
            >
              delete
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CommentReplyCard;
