import { formatDistanceToNow, parseISO } from "date-fns";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { openPostForm } from "../../features/postFormSlice";
import iconList from "../../lib/iconList";
import { useDeletePostMutation } from "../../services/postsApi";
import { PostType } from "../../types/PostType";
import { UserType } from "../../types/UserType";

type PostCardType = {
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
}: PostCardType) => {
  const { user, status } = useAppSelector(selectAuth);
  const isAuthorized = user?.uid === author.uid;
  const [deletePost, result] = useDeletePostMutation();

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

  // handlers
  const handleDelete = async () => {
    try {
      await deletePost(id);
    } catch (error) {
      toast.error("error in deleting post!", { id: "deletepost" });
    }
  };
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
              {formatDistanceToNow(
                parseISO(modifiedAt ? modifiedAt : createdAt)
              )}{" "}
              ago
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
        <button className="btn px-2 py-1.5 btn-theme">
          {likes.length}
          <span className="text-base">{iconList.like}</span>
        </button>
        <Link to={`/post/${id}`} className="btn px-2 py-1.5 btn-theme">
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
  ) : null;
};

export default PostCard;
