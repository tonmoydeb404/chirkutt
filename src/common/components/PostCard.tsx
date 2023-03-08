import { formatDistanceToNow, parseISO } from "date-fns";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { openPostForm } from "../../features/postFormSlice";
import { showShare } from "../../features/share/shareSlice";
import iconList from "../../lib/iconList";
import {
  useAddNotificationMutation,
  useRemoveNotificationsMutation,
  useRemovePostNotificationsMutation,
} from "../../services/notificationsApi";
import {
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../../services/postsApi";
import {
  useAddSavedPostMutation,
  useRemoveSavedPostMutation,
} from "../../services/savedApi";
import { AuthUserType } from "../../types/AuthType";
import { NotificationType } from "../../types/NotificationType";
import { PostDetailsType, PostType } from "../../types/PostType";

const PostCard = ({
  id,
  text,
  createdAt,
  modifiedAt,
  likes,
  author,
  authorUID,
  comments,
  isSaved,
}: PostDetailsType) => {
  const { user: authUser, status } = useAppSelector(selectAuth);
  const isAuthorized = authUser?.uid === author.uid;
  const [deletePost, result] = useDeletePostMutation();
  const [updatePost, updateResult] = useUpdatePostMutation();
  const [savePost, saveResult] = useAddSavedPostMutation();
  const [removePost, removeResult] = useRemoveSavedPostMutation();
  const [createNotification, createNotificationResult] =
    useAddNotificationMutation();
  const [removeNotifications] = useRemoveNotificationsMutation();
  const [removePostNotifications] = useRemovePostNotificationsMutation();
  const navigate = useNavigate();

  // dispatch
  const dispatch = useAppDispatch();
  // effects
  useEffect(() => {
    // toasts
    if (!result.isUninitialized && result.isSuccess) {
      toast.success("successfully deleted post", { id: "deletepost" });
    }
    if (!result.isUninitialized && result.isError) {
      toast.error("cannot delete post", { id: "deletepost" });
    }

    return () => {
      result.reset();
    };
  }, [result]);

  // handle delete
  const handleDelete = async () => {
    try {
      await deletePost(id);
      await removePostNotifications(id);
    } catch (error) {
      toast.error("error in deleting post!", { id: "deletepost" });
    }
  };
  // handle edit
  const handleEdit = () => {
    const post: PostType = {
      id,
      text,
      createdAt,
      modifiedAt,
      likes,
      authorUID,
    };
    dispatch(openPostForm({ type: "EDIT", value: post }));
  };
  // handle save
  const handleBookmark = async () => {
    if (!authUser) {
      return;
    }

    try {
      if (isSaved) {
        // remove bookmark
        await removePost({
          uid: authUser.uid,
          id,
        }).unwrap();
      } else {
        // add bookmark
        await savePost({
          uid: authUser.uid,
          post: { postID: id, savedAt: new Date().toISOString() },
        }).unwrap();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // create notification handler
  const createLikeNotification = async (user: AuthUserType) => {
    try {
      // don't create notification for the post author own like
      if (user.uid === authorUID) return true;

      const newNotification: NotificationType = {
        id: `${id}:${authorUID}`,
        eventID: id,
        userID: authorUID,
        createdAt: Date.now(),
        path: `/post/${id}`,
        status: "UNSEEN",
        text: `${user.name} is liked your post`,
        type: "LIKE",
      };
      const response = await createNotification(newNotification).unwrap();

      return newNotification.id;
    } catch (error) {
      return false;
    }
  };

  // add like
  const addLike = async (user: AuthUserType) => {
    try {
      await updatePost({
        id: id,
        updates: { likes: [...likes, user.uid] },
      }).unwrap();
      await createLikeNotification(user);
    } catch (error) {
      console.log(error);
    }
  };

  // remove like
  const removeLike = async (user: AuthUserType) => {
    try {
      // remove like
      await updatePost({
        id: id,
        updates: { likes: [...likes.filter((i) => i != user.uid)] },
      }).unwrap();
      await removeNotifications([`${id}:${authorUID}`]);
    } catch (error) {
      console.log(error);
    }
  };

  // handle post reaction
  const handleReaction = async () => {
    if (!authUser) {
      navigate("/signin");
      return;
    }

    try {
      if (!likes.includes(authUser.uid)) {
        await addLike(authUser);
      } else {
        await removeLike(authUser);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle share
  const handleShare = () => {
    const sharePost = {
      text,
      avatar: author.avatar,
      author: author.name,
    };
    dispatch(showShare(sharePost));
  };

  return author ? (
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
              {formatDistanceToNow(parseISO(createdAt))} ago
            </span>
          </div>
        </div>
        {/* actions */}
        <div className="flex items-center ml-auto gap-1">
          {isAuthorized ? (
            <label className="dropdown">
              <input type="checkbox" id={`drop-${id}`} />
              <label
                htmlFor={`drop-${id}`}
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
          ) : null}
        </div>
      </section>
      {/* body part */}
      <section className="flex flex-col mb-3">
        <p className="text-base whitespace-pre-line">{text}</p>
      </section>
      {/* footer part */}
      <section className="flex items-center gap-1">
        <button
          className={`btn px-2 py-1.5 btn-theme`}
          onClick={handleReaction}
        >
          {likes.length}
          <span
            className={`text-base  ${
              authUser && likes.includes(authUser.uid) ? "text-primary-600" : ""
            }`}
          >
            {
              iconList[
                authUser && likes.includes(authUser.uid) ? "liked" : "like"
              ]
            }
          </span>
        </button>
        <Link to={`/post/${id}`} className="btn px-2 py-1.5 btn-theme">
          {comments.length}
          <span className="text-base">{iconList.comment}</span>
        </Link>

        <button
          className="btn-icon btn-sm btn-theme ml-auto"
          onClick={handleShare}
        >
          {iconList.share}
        </button>
        {authUser ? (
          <button
            className="btn-icon btn-theme btn-sm"
            onClick={handleBookmark}
          >
            {iconList[isSaved ? "remove_bookmark" : "add_bookmark"]}
          </button>
        ) : null}
      </section>
    </article>
  ) : null;
};

export default PostCard;
