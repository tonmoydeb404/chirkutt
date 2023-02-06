import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import PostCard from "../common/components/PostCard";
import { selectAuth } from "../features/auth/authSlice";
import { useGetAllCommentsQuery } from "../services/commentsApi";
import { useGetAllPostsQuery } from "../services/postsApi";
import { useLazyGetSavedPostsQuery } from "../services/savedApi";
import { useGetAllUsersQuery } from "../services/usersApi";

const Home = () => {
  const { user: authUser, status } = useAppSelector(selectAuth);
  const posts = useGetAllPostsQuery({});
  const users = useGetAllUsersQuery({});
  const comments = useGetAllCommentsQuery({});
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

  if (posts.isError || users.isError) {
    return <p>something wents to wrong</p>;
  }

  if (
    posts.isSuccess &&
    posts.data &&
    users.isSuccess &&
    users.data &&
    comments.isSuccess &&
    comments.data
  ) {
    return (
      <div className="flex flex-col gap-3">
        {Object.keys(posts.data).length
          ? Object.keys(posts.data).map((key: string) => {
              const post = posts.data[key];
              const author = users.data[post.authorUID];
              const postComments = Object.keys(comments.data).filter(
                (c) => comments.data[c].postID === post.id
              );
              const isSaved = !!savedPostResult?.data?.[post.id];
              return (
                <PostCard
                  key={post.id}
                  {...post}
                  author={author}
                  comments={postComments.length}
                  isSaved={isSaved}
                />
              );
            })
          : "no more posts"}
      </div>
    );
  }

  return <p>loading...</p>;
};

export default Home;
