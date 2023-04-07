import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import CommentForm from "../common/components/comment/CommentForm";
import CommentsFeed from "../common/components/comment/CommentsFeed";
import PostCard from "../common/components/post/card/PostCard";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
import PostCommentSekeleton from "../common/components/skeletons/PostCommentSkeleton";
import usePostComments from "../common/hooks/usePostComments";
import usePosts from "../common/hooks/usePosts";
import { PostDetails } from "../types/PostType";

const Post = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) return <Navigate to={"/404"} />;
  const { posts, isLoading, isError } = usePosts();
  const {
    comments,
    isLoading: commentsLoading,
    isError: commentsError,
  } = usePostComments(id);

  const [post, setPost] = useState<PostDetails | undefined | null>(null);

  // find post state
  useEffect(() => {
    if (id && posts && !isLoading) {
      const fpost = posts.find((p) => p.content.id === id);
      if (!fpost) {
        navigate("/404");
      } else {
        setPost(fpost);
      }
    }

    // cleanup
    return () => {
      setPost(null);
    };
  }, [posts, id, isLoading]);

  return (
    <>
      <Helmet>
        {post ? (
          <title>
            {post.content.text.split(" ").slice(0, 5).join(" ")} - Chirkutt
          </title>
        ) : null}
      </Helmet>
      {/* post loading state */}
      {post === null ? <PostCardSekeleton /> : null}

      {/* post success state */}
      {post ? <PostCard key={post.content.id} {...post} /> : null}

      {post && !post.author?.isDeleted ? (
        <CommentForm
          postID={post.content.id}
          authorUID={post.content.authorUID}
        />
      ) : null}

      <div className="flex items-center justify-between mt-10">
        <h3 className="">All Comments</h3>
      </div>

      {post && comments ? (
        <CommentsFeed
          comments={comments}
          postAuthorUID={post.content.authorUID}
        />
      ) : null}
      {commentsLoading ? (
        <div className="comments mt-5">
          <PostCommentSekeleton />
          <PostCommentSekeleton />
          <PostCommentSekeleton />
          <PostCommentSekeleton />
        </div>
      ) : null}
    </>
  );
};

export default Post;
