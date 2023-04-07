import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  useAddSavedPostMutation,
  useRemoveSavedPostMutation,
} from "../../../../api/savedApi";
import { useAppSelector } from "../../../../app/hooks";
import { selectAuth } from "../../../../features/auth/authSlice";
import { showShare } from "../../../../features/share/shareSlice";
import iconList from "../../../../lib/iconList";
import { PostDetails } from "../../../../types/PostType";
import PostCardReaction from "./PostCardReaction";

const PostCardFooter = ({
  author,
  comments,
  isSaved,
  content,
}: PostDetails) => {
  const { user: authUser, status } = useAppSelector(selectAuth);
  const dispatch = useDispatch();
  const [savePost] = useAddSavedPostMutation();
  const [removeSavedPost] = useRemoveSavedPostMutation();

  // is post liked
  const isLiked = authUser ? content.likes.includes(authUser.uid) : false;
  // handle save
  const handleBookmark = async () => {
    if (!authUser) {
      return;
    }

    try {
      if (isSaved) {
        // remove bookmark
        await removeSavedPost({
          uid: authUser.uid,
          postID: content.id,
        }).unwrap();
      } else {
        // add bookmark
        await savePost({
          uid: authUser.uid,
          post: { postID: content.id, savedAt: Date.now() },
        }).unwrap();
      }
    } catch (err) {
      console.log(err);
    }
  };
  // handle share
  const handleShare = () => {
    const sharePost = {
      text: content.text,
      avatar: author.avatar,
      author: author.name,
    };
    dispatch(showShare(sharePost));
  };

  return (
    <section className="flex items-center gap-1 mt-3">
      <PostCardReaction
        disabled={!!author.isDeleted}
        isLiked={isLiked}
        post={content}
        postLikes={content.likes.length}
      />
      <Link to={`/post/${content.id}`} className="btn px-2 py-1.5 btn-theme">
        {comments.length}
        <span className="text-base">{iconList.comment}</span>
      </Link>

      <button
        className="btn-icon btn-sm btn-theme ml-auto"
        onClick={handleShare}
      >
        {iconList.share}
      </button>
      {status === "AUTHORIZED" ? (
        <button className="btn-icon btn-theme btn-sm" onClick={handleBookmark}>
          {iconList[isSaved ? "remove_bookmark" : "add_bookmark"]}
        </button>
      ) : null}
    </section>
  );
};

export default PostCardFooter;
