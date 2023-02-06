import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import PostCard from "../common/components/PostCard";
import { selectAuth } from "../features/auth/authSlice";
import { useGetAllCommentsQuery } from "../services/commentsApi";
import { useLazySearchPostsQuery } from "../services/postsApi";
import { useLazyGetSavedPostsQuery } from "../services/savedApi";
import { useGetAllUsersQuery } from "../services/usersApi";

const Search = () => {
  const [searchQuery] = useSearchParams();
  const query = searchQuery.get("q");

  if (!query) return <Navigate to={"/"} />;

  const { user: authUser, status } = useAppSelector(selectAuth);
  const [getSearchPosts, posts] = useLazySearchPostsQuery();
  const users = useGetAllUsersQuery({});
  const comments = useGetAllCommentsQuery({});
  const [getSavedPost, savedPostResult] = useLazyGetSavedPostsQuery();

  // trigger get query posts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (query) {
          await getSearchPosts(query).unwrap();
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchPost();
  }, [query]);

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
          : "cannot find any posts"}
      </div>
    );
  }

  return <p>loading...</p>;
};

export default Search;
