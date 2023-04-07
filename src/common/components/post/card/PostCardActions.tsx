import { toast } from "react-hot-toast";
import { useRemovePostNotificationsMutation } from "../../../../api/notificationsApi";
import { useDeletePostMutation } from "../../../../api/postsApi";
import { useAppDispatch } from "../../../../app/hooks";
import { updatePostModal } from "../../../../features/postModal/postModalSlice";
import iconList from "../../../../lib/iconList";
import { PostType } from "../../../../types/PostType";

type PostCardActionsProps = {
  post: PostType;
};
const PostCardActions = ({ post }: PostCardActionsProps) => {
  const dispatch = useAppDispatch();
  const [deletePost, result] = useDeletePostMutation();
  const [removePostNotifications] = useRemovePostNotificationsMutation();

  // handle delete
  const handleDelete = async () => {
    try {
      await deletePost(post.id).unwrap();
      await removePostNotifications(post.id);
    } catch (error) {
      toast.error("error in deleting post!", { id: "deletepost" });
    }
  };
  // handle edit
  const handleEdit = () => {
    dispatch(updatePostModal(post));
  };

  return (
    <div className="flex items-center ml-auto gap-1">
      <label className="dropdown">
        <input type="checkbox" id={`drop-${post.id}`} />
        <label
          htmlFor={`drop-${post.id}`}
          className="btn-icon btn-sm btn-ghost"
        >
          {iconList.more}
        </label>

        <ul>
          <li onClick={handleEdit}>Edit Post</li>
          <li className="text-error-600" onClick={handleDelete}>
            Delete Post
          </li>
        </ul>
      </label>
    </div>
  );
};

export default PostCardActions;
