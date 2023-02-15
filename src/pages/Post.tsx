import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useParams } from "react-router-dom";
import CommentForm from "../common/components/CommentForm";
import PostCard from "../common/components/PostCard";
import PostComment from "../common/components/PostComment";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
import PostCommentSekeleton from "../common/components/skeletons/PostCommentSkeleton";
import usePostComments from "../common/hooks/usePostComments";
import usePosts from "../common/hooks/usePosts";
import { usePrivateAuth } from "../common/outlet/PrivateOutlet";
import { PostDetailsType } from "../types/PostType";

const Post = () => {
  const { id } = useParams();
  if (!id) return <Navigate to={"/404"} />;

  const auth = usePrivateAuth();
  const { posts, isLoading, isError } = usePosts();
  const {
    comments,
    isLoading: commentsLoading,
    isError: commentsError,
  } = usePostComments(id);

  const [post, setPost] = useState<PostDetailsType | undefined | null>(null);

  // find post state
  useEffect(() => {
    if (id && posts && !isLoading) {
      const fpost = posts.find((p) => p.id === id);
      setPost(fpost);
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
          <title>{post.text.split(" ").slice(0, 5).join(" ")} - Chirkutt</title>
        ) : null}
      </Helmet>
      {/* post loading state */}
      {post === null ? <PostCardSekeleton /> : null}

      {/* post success state */}
      {post ? <PostCard {...post} /> : null}

      {post ? (
        <CommentForm postID={post.id} authorUID={post.authorUID} />
      ) : null}

      <div className="flex items-center justify-between mt-10">
        <h3 className="">All Comments</h3>
      </div>

      {post && comments ? (
        <div className="comments mt-5">
          {comments.length
            ? comments.map((comment, _, arr) => {
                // avoid reply
                if (comment.parentID !== null) return null;

                const commentReplies = arr
                  .filter((replay) => replay.parentID === comment.id)
                  .sort((replayA, replayB) => {
                    return (
                      new Date(replayA.createdAt).getTime() -
                      new Date(replayB.createdAt).getTime()
                    );
                  });

                return (
                  <PostComment
                    postAuthorUID={post.authorUID}
                    key={comment.id}
                    {...comment}
                    replay
                  >
                    {commentReplies.map((replay) => {
                      return (
                        <PostComment
                          postAuthorUID={post.authorUID}
                          key={replay.id}
                          {...replay}
                          replay={false}
                        />
                      );
                    })}
                  </PostComment>
                );
              })
            : "no comments are found"}
        </div>
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
