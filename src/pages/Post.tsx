import { Helmet } from "react-helmet";
import { Navigate, useParams } from "react-router-dom";
import CommentForm from "../common/components/comment/CommentForm";
import CommentsFeed from "../common/components/comment/CommentsFeed";
import PostCard from "../common/components/post/card/PostCard";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
import PostCommentSekeleton from "../common/components/skeletons/PostCommentSkeleton";
import usePost from "../common/hooks/usePost";
import usePostComments from "../common/hooks/usePostComments";

const Post = () => {
  const { id } = useParams();
  if (!id) return <Navigate to={"/404"} />;
  const { post, isLoading, isError, error } = usePost(id);
  const {
    comments,
    isLoading: commentsLoading,
    isError: commentsError,
  } = usePostComments(id);

  if (!post && error === "document not found") return <Navigate to={"/404"} />;

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
      {isLoading ? <PostCardSekeleton /> : null}

      {/* post success state */}
      {post ? <PostCard key={post.content.id} {...post} /> : null}

      {post && !post.author?.isDeleted ? (
        <CommentForm
          postID={post.content.id}
          authorUID={post.content.authorUID}
        />
      ) : null}

      {post && comments ? (
        <>
          <div className="flex items-center justify-between mt-10">
            <h3 className="">All Comments</h3>
          </div>

          <CommentsFeed
            comments={comments}
            postAuthorUID={post.content.authorUID}
          />
        </>
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
