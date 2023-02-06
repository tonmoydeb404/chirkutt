import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import CommentForm from "../common/components/CommentForm";
import PostCard from "../common/components/PostCard";
import PostComment from "../common/components/PostComment";
import { selectAuth } from "../features/auth/authSlice";
import {
  useDeleteCommentMutation,
  useGetPostCommentsQuery,
} from "../services/commentsApi";
import { useGetAllPostsQuery } from "../services/postsApi";
import { useLazyGetSavedPostsQuery } from "../services/savedApi";
import { useGetAllUsersQuery } from "../services/usersApi";

const Post = () => {
  const { id } = useParams();
  if (!id) return <Navigate to={"/404"} />;

  const { user: authUser, status } = useAppSelector(selectAuth);
  const posts = useGetAllPostsQuery({});
  const users = useGetAllUsersQuery({});
  const comments = useGetPostCommentsQuery(id);
  const [deleteComment, deleteResult] = useDeleteCommentMutation();
  const [getSavedPost, savedPostResult] = useLazyGetSavedPostsQuery();

  // trigger get saved post
  useEffect(() => {
    const fetchSavedPost = async () => {
      if (status === "AUTHORIZED" && authUser) {
        try {
          await getSavedPost(authUser.uid).unwrap();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchSavedPost();
  }, [authUser, status]);

  // handle delete
  const handleDeleteComment = async (id: string) => {
    try {
      // check commments data
      if (!comments.data || !comments.data[id]) return;

      const comment = comments.data[id];
      const idList = [comment.id];

      // look for comment replyies
      if (comment.parentID === null) {
        Object.keys(comments.data).forEach((key) => {
          const replay = comments.data?.[key];
          if (replay?.parentID === comment.id) {
            idList.push(replay.id);
          }
        });
      }

      await deleteComment(idList);
    } catch (e) {}
  };

  // error state
  if (posts.isError || users.isError) {
    return <p>something wents to wrong</p>;
  }
  // success state
  if (
    posts.isSuccess &&
    posts.data &&
    users.isSuccess &&
    users.data &&
    comments.data &&
    comments.isSuccess
  ) {
    const post = posts.data[id];
    const user = users.data[post.authorUID];
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

        <CommentForm postID={post.id} />

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
                      key={comment.id}
                      {...comment}
                      author={commentAuthor}
                      replay
                      handleDeleteComment={handleDeleteComment}
                    >
                      {commentRepliesId.map((replayId) => {
                        const replay = comments.data[replayId];
                        const replayAuthor = users.data[replay.authorUID];

                        return (
                          <PostComment
                            key={replay.id}
                            {...replay}
                            author={replayAuthor}
                            replay={false}
                            handleDeleteComment={handleDeleteComment}
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
