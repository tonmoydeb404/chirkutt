import { useNavigate } from "react-router-dom";
import {
  useAddNotificationMutation,
  useRemoveNotificationsMutation,
} from "../../../../api/notificationsApi";
import {
  useDislikePostMutation,
  useLikePostMutation,
} from "../../../../api/postsApi";
import { useAppSelector } from "../../../../app/hooks";
import { selectAuth } from "../../../../features/auth/authSlice";
import iconList from "../../../../lib/iconList";
import { AuthUserType } from "../../../../types/AuthType";
import { NotificationType } from "../../../../types/NotificationType";
import { PostType } from "../../../../types/PostType";

type PostCardReactionProps = {
  disabled: boolean;
  postLikes: number;
  isLiked: boolean;
  post: PostType;
};

const PostCardReaction = ({
  disabled,
  isLiked,
  postLikes,
  post,
}: PostCardReactionProps) => {
  const { user: authUser } = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const [likePost] = useLikePostMutation();
  const [dislikePost] = useDislikePostMutation();
  const [createNotification] = useAddNotificationMutation();
  const [removeNotifications] = useRemoveNotificationsMutation();

  // create notification handler
  const createLikeNotification = async (user: AuthUserType) => {
    try {
      // don't create notification for the post author own like
      if (authUser?.uid === post.authorUID) return true;
      const newNotification: NotificationType = {
        id: `${post.id}:${post.authorUID}`,
        eventID: post.id,
        userID: post.authorUID,
        createdAt: Date.now(),
        path: `/post/${post.id}`,
        status: "UNSEEN",
        text: `${user.name} is liked your post`,
        type: "LIKE",
      };
      await createNotification(newNotification).unwrap();
      return newNotification.id;
    } catch (error) {
      return false;
    }
  };
  // handle post reaction
  const handleReaction = async () => {
    if (!authUser) {
      navigate("/signin");
      return;
    }

    try {
      if (!isLiked) {
        await likePost({ id: post.id, uid: authUser.uid });
        await createLikeNotification(authUser);
      } else {
        await dislikePost({ id: post.id, uid: authUser.uid });
        await removeNotifications([`${post.id}:${post.authorUID}`]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      className={`btn px-2 py-1.5 btn-theme`}
      onClick={handleReaction}
      disabled={disabled}
    >
      {postLikes}
      <span className={`text-base ${isLiked ? "text-primary-600" : ""}`}>
        {iconList[isLiked ? "liked" : "like"]}
      </span>
    </button>
  );
};

export default PostCardReaction;
