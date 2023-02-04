import { Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import PostCard from "../common/components/PostCard";
import { selectAuth } from "../features/auth/authSlice";
import iconList from "../lib/iconList";
import { useGetAllCommentsQuery } from "../services/commentsApi";
import { useGetAllPostsQuery } from "../services/postsApi";
import { useGetUserQuery } from "../services/usersApi";

const User = () => {
  const comments = useGetAllCommentsQuery({});

  const { username } = useParams();
  // navigate to error page
  if (!username) return <Navigate to={"/404"}></Navigate>;

  const { user: authUser, status } = useAppSelector(selectAuth);
  const {
    data: user,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetUserQuery({ username });
  const posts = useGetAllPostsQuery({});

  // navigate to profile page if authorized username and page username matched
  if (status === "AUTHORIZED" && authUser?.username === username)
    return <Navigate to={"/profile"}></Navigate>;

  // success state
  if (user && isSuccess) {
    return (
      <>
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row items-start gap-3 box p-3 sm:p-4 rounded">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-[60px] rounded"
            />

            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <span>-</span>
                <span
                  title="copy profile link"
                  className="text-primary-600 text-sm hover:text-primary-700 cursor-copy"
                >
                  @{user.username}
                </span>
              </div>
              {user.bio ? <p className="text-sm w-full">{user.bio}</p> : null}

              <div className="flex items-center gap-1 mt-3">
                <a
                  href={`mailto:${user.email}`}
                  target={"_blank"}
                  className="btn btn-sm btn-theme ml-auto"
                >
                  {iconList.email}
                  email
                </a>
              </div>
            </div>
          </div>

          <div className="grid min-[500px]:grid-cols-2 sm:grid-cols-3 mt-2 gap-2">
            <div className="flex items-start gap-1 py-2 sm:py-2.5 px-2 sm:px-3 box rounded">
              <span className="text-[40px] text-primary-600">
                {iconList.post}
              </span>
              <div className="flex flex-col gap-0">
                <h3 className="text-xs uppercase tracking-wide">Chirkutts</h3>
                <h2 className="text-xl font-bold">20</h2>
              </div>
            </div>

            <div className="flex items-start gap-1 py-2 sm:py-2.5 px-2 sm:px-3 box rounded">
              <span className="text-[40px] text-success-600">
                {iconList.like}
              </span>
              <div className="flex flex-col gap-0">
                <h3 className="text-xs uppercase tracking-wide">Likes</h3>
                <h2 className="text-xl font-bold">200</h2>
              </div>
            </div>

            <div className="flex items-start gap-1 py-2 sm:py-2.5 px-2 sm:px-3 box rounded">
              <span className="text-[40px] text-warning-600">
                {iconList.comment}
              </span>
              <div className="flex flex-col gap-0">
                <h3 className="text-xs uppercase tracking-wide">comments</h3>
                <h2 className="text-xl font-bold">200</h2>
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
                    return post.authorUID === user.uid ? (
                      <PostCard
                        comments={postComments.length}
                        key={post.id}
                        {...post}
                        author={user}
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
  if (!user && isError) {
    return (
      <div>
        {typeof error === "string" ? error : "something wents to wrong"}
      </div>
    );
  }

  return <div>loading...</div>;
};

export default User;
