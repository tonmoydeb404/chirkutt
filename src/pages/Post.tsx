import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import CommentForm from "../common/components/CommentForm";
import PostCard from "../common/components/PostCard";
import PostComment from "../common/components/PostComment";
import { useAuth } from "../common/outlet/PrivateOutlet";
import { useLazyGetPostCommentsQuery } from "../services/commentsApi";
import { useGetAllPostsQuery } from "../services/postsApi";
import { useLazyGetSavedPostsQuery } from "../services/savedApi";
import { useGetAllUsersQuery } from "../services/usersApi";

const Post = () => {
  const { id } = useParams();
  if (!id) return <Navigate to={"/404"} />;

  const auth = useAuth();
  const posts = useGetAllPostsQuery();
  const users = useGetAllUsersQuery({});
  const [getComments, comments] = useLazyGetPostCommentsQuery();
  const [getSavedPost, savedPostResult] = useLazyGetSavedPostsQuery();

  // trigger get comments
  useEffect(() => {
    const fetchComments = async () => {
      await getComments(id);
    };

    fetchComments();
  }, [id]);

  // trigger get saved post
  useEffect(() => {
    const fetchSavedPost = async () => {
      if (auth && auth.status === "AUTHORIZED" && auth.user) {
        try {
          await getSavedPost(auth.user.uid).unwrap();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchSavedPost();
  }, [auth]);

  // error state
  if (posts.isError || users.isError) {
    return <p>something wents to wrong</p>;
  }
  // success state
  if (
    posts.isSuccess &&
    posts.data &&
    posts.data[id] &&
    users.isSuccess &&
    users.data &&
    comments.data &&
    comments.isSuccess
  ) {
    const post = posts.data[id];
    const user = users.data[post?.authorUID];
    const postComments = Object.keys(comments.data).filter(
      (c) => comments.data[c].postID === post.id
    );
    const isSaved = !!savedPostResult?.data?.[post.id];

    return (
      <>
        <PostCard
          isSaved={isSaved}
          {...post}
          author={user}
          comments={postComments.length}
        />

        <CommentForm postID={post.id} authorUID={post.authorUID} />

        <div className="flex items-center justify-between mt-10">
          <h3 className="">All Comments</h3>
        </div>

        {comments.isSuccess ? (
          <div className="comments mt-5">
            {comments.data && Object.keys(comments.data).length
              ? Object.keys(comments.data).map((commentId, _, arr) => {
                  const comment = comments.data[commentId];

                  if (comment.parentID !== null) return null;

                  const commentAuthor = users.data[comment.authorUID];
                  const commentRepliesId = arr
                    .filter((replayId) => {
                      const replay = comments.data[replayId];

                      return (
                        replay.parentID === comment.id &&
                        replay.postID === post.id
                      );
                    })
                    .sort((a, b) => {
                      return (
                        new Date(comments.data[a].createdAt).getTime() -
                        new Date(comments.data[b].createdAt).getTime()
                      );
                    });

                  return (
                    <PostComment
                      postAuthorUID={post.authorUID}
                      key={comment.id}
                      {...comment}
                      author={commentAuthor}
                      replay
                    >
                      {commentRepliesId.map((replayId) => {
                        const replay = comments.data[replayId];
                        const replayAuthor = users.data[replay.authorUID];

                        return (
                          <PostComment
                            postAuthorUID={post.authorUID}
                            key={replay.id}
                            {...replay}
                            author={replayAuthor}
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
        {comments.isLoading ? "loading..." : null}
      </>
    );
  }

  // loading state
  return <p>loading...</p>;
};

export default Post;
