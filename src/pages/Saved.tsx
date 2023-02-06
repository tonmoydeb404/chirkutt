import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import PostCard from "../common/components/PostCard";
import { selectAuth } from "../features/auth/authSlice";
import iconList from "../lib/iconList";
import { useGetAllCommentsQuery } from "../services/commentsApi";
import { useGetAllPostsQuery } from "../services/postsApi";
import { useLazyGetSavedPostsQuery } from "../services/savedApi";
import { useGetAllUsersQuery } from "../services/usersApi";

const Saved = () => {
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

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Saved Posts</h3>

        <button className="btn btn-sm btn-theme">
          remove all <span>{iconList.remove}</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-5">
        {posts.data && users.data && comments.data && savedPostResult.isSuccess
          ? Object.keys(savedPostResult.data).map((postId) => {
              const post = posts.data[postId];
              // return null if there is no post
              if (!post) return null;
              const author = users.data[post.authorUID];
              const postComments = comments.data
                ? Object.keys(comments.data).filter(
                    (c) => comments.data?.[c]?.postID === post.id
                  )
                : [];
              return (
                <PostCard
                  key={post.id}
                  {...post}
                  author={author}
                  comments={postComments.length}
                  isSaved={true}
                />
              );
            })
          : null}

        {savedPostResult.isLoading ||
        posts.isLoading ||
        users.isLoading ||
        comments.isLoading
          ? "loading"
          : null}

        {savedPostResult.isError ||
        (savedPostResult.data && !Object.keys(savedPostResult?.data).length)
          ? "nothing here"
          : null}
      </div>
    </>
  );
};

export default Saved;
