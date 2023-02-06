import { formatDistanceToNow, parseISO } from "date-fns";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { openPostForm } from "../../features/postFormSlice";
import iconList from "../../lib/iconList";
import {
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../../services/postsApi";
import {
  useAddSavedPostMutation,
  useRemoveSavedPostMutation,
} from "../../services/savedApi";
import { PostType } from "../../types/PostType";
import { UserType } from "../../types/UserType";

type PostCardType = {
  comments: number;
  isSaved: boolean;
  author: UserType;
} & PostType;

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
}: PostCardType) => {
  const { user, status } = useAppSelector(selectAuth);
  const isAuthorized = user?.uid === author.uid;
  const [deletePost, result] = useDeletePostMutation();
  const [updatePost, updateResult] = useUpdatePostMutation();
  const [savePost, saveResult] = useAddSavedPostMutation();
  const [removePost, removeResult] = useRemoveSavedPostMutation();
  const navigate = useNavigate();

  // dispatch
  const dispatch = useAppDispatch();

  // effects
  useEffect(() => {
    // toasts
    if (!result.isUninitialized && result.isLoading) {
      toast.loading("deleting post", { id: "deletepost" });
    }
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
    if (!user) {
      return;
    }

    try {
      if (isSaved) {
        // remove bookmark
        await removePost({
          uid: user.uid,
          id,
        }).unwrap();
      } else {
        // add bookmark
        await savePost({
          uid: user.uid,
          post: { postID: id, savedAt: new Date().toISOString() },
        }).unwrap();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // handle post reaction
  const handleReaction = async () => {
    if (!user) {
      navigate("/signin");
      return;
    }

    if (likes.includes(user.uid)) {
      // remove like
      await updatePost({
        id: id,
        updates: { likes: [...likes.filter((i) => i != user.uid)] },
      });
    } else {
      // add like
      await updatePost({ id: id, updates: { likes: [...likes, user.uid] } });
    }
  };

  return author ? (
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
        <p className="text-base">{text}</p>
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
              user && likes.includes(user.uid) ? "text-primary-600" : ""
            }`}
          >
            {iconList[user && likes.includes(user.uid) ? "liked" : "like"]}
          </span>
        </button>
        <Link to={`/post/${id}`} className="btn px-2 py-1.5 btn-theme">
          {comments}
          <span className="text-base">{iconList.comment}</span>
        </Link>

        <button className="btn-icon btn-sm btn-theme ml-auto">
          {iconList.share}
        </button>
        {user ? (
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
