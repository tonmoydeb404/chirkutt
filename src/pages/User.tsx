import { useEffect } from "react";
import { BiCopyAlt } from "react-icons/bi";
import { Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import PostCard from "../common/components/PostCard";
import { selectAuth } from "../features/auth/authSlice";
import iconList from "../lib/iconList";
import { useGetAllCommentsQuery } from "../services/commentsApi";
import { useGetAllPostsQuery } from "../services/postsApi";
import { useLazyGetSavedPostsQuery } from "../services/savedApi";
import { useLazyGetUserQuery } from "../services/usersApi";

const User = () => {
  const { uid } = useParams();
  // navigate to error page
  if (!uid) return <Navigate to={"/404"}></Navigate>;

  const auth = useAppSelector(selectAuth);
  const [getUser, user] = useLazyGetUserQuery();
  const comments = useGetAllCommentsQuery({});
  const posts = useGetAllPostsQuery();

  const [getSavedPost, savedPostResult] = useLazyGetSavedPostsQuery();

  // trigger get saved post
  useEffect(() => {
    const fetchSavedPost = async () => {
      if (uid) {
        try {
          await getSavedPost(uid).unwrap();
          await getUser(uid);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchSavedPost();
  }, [uid]);

  // navigate to profile page if authorized username and page username matched
  if (auth?.user?.uid === uid) return <Navigate to={"/profile"}></Navigate>;

  // success state
  if (user.isSuccess) {
    return (
      <>
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row items-start gap-3 box p-3 sm:p-4 rounded">
            <img
              src={user.data.avatar}
              alt={user.data.name}
              className="w-[60px] rounded"
            />

            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{user.data.name}</h2>
                <span>-</span>
                <span
                  title="copy profile link"
                  className="text-primary-600 text-sm hover:text-primary-700 cursor-copy"
                >
                  <BiCopyAlt />
                </span>
              </div>
              {user.data.bio ? (
                <p className="text-sm w-full">{user.data.bio}</p>
              ) : null}

              <div className="flex items-center gap-1 mt-3">
                <a
                  href={`mailto:${user.data.email}`}
                  target={"_blank"}
                  className="btn btn-sm btn-theme ml-auto"
                >
                  {iconList.email}
                  email
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Posts</h3>
            </div>

            <div className="flex flex-col gap-3 mt-3">
              {posts.isLoading ? <p>loading...</p> : null}
              {posts.isError ? <p>something wents to wrong...</p> : null}
              {posts.data &&
              posts.isSuccess &&
              Object.keys(posts.data).length &&
              comments.data &&
              comments.isSuccess
                ? Object.keys(posts.data).map((key: string) => {
                    const post = posts.data[key];
                    const postComments = Object.keys(comments.data).filter(
                      (c) => comments.data[c].postID === post.id
                    );
                    const isSaved = !!savedPostResult?.data?.[post.id];
                    return post.authorUID === user.data.uid ? (
                      <PostCard
                        comments={postComments.length}
                        key={post.id}
                        {...post}
                        author={user.data}
                        isSaved={isSaved}
                      />
                    ) : null;
                  })
                : "no more posts"}
            </div>
          </div>
        </div>
      </>
    );
  }

  // error state
  if (user.isError) {
    return (
      <div>
        {typeof user.error === "string"
          ? user.error
          : "something wents to wrong"}
      </div>
    );
  }

  return <div>loading...</div>;
};

export default User;
