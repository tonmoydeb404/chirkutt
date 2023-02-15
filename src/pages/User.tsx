import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import PostCard from "../common/components/PostCard";
import ProfileCard from "../common/components/ProfileCard";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
import ProfileCardSkeleton from "../common/components/skeletons/ProfileCardSkeleton";
import useUserPosts from "../common/hooks/useUserPosts";
import { selectAuth } from "../features/auth/authSlice";
import { useLazyGetUserQuery } from "../services/usersApi";

const User = () => {
  const { uid } = useParams();
  // navigate to error page
  if (!uid) return <Navigate to={"/404"}></Navigate>;
  const auth = useAppSelector(selectAuth);
  const [getUser, user] = useLazyGetUserQuery();
  const { posts, isLoading, isError } = useUserPosts(uid);

  // trigger get user
  useEffect(() => {
    const fetchUser = async () => {
      if (uid) {
        try {
          await getUser(uid).unwrap();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchUser();
  }, [uid]);

  // navigate to profile page if authorized username and page username matched
  if (auth?.user?.uid === uid) return <Navigate to={"/profile"}></Navigate>;

  return (
    <>
      <Helmet>
        {user.data && user.isSuccess ? (
          <title>{user.data?.name} - Chirkutt</title>
        ) : null}
      </Helmet>
      <div className="flex flex-col">
        {/* user data state */}
        {user.isSuccess && user.data ? (
          <ProfileCard
            avatar={user.data.avatar}
            bio={user.data.bio}
            email={user.data.email}
            name={user.data.name}
          />
        ) : null}
        {/* user loading state */}
        {(user.isLoading || !user.data) && !user.isError ? (
          <ProfileCardSkeleton />
        ) : null}

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Recent Posts</h3>
          </div>

          <div className="flex flex-col gap-3 mt-3">
            {/* posts loading state */}
            {isLoading ? (
              <>
                <PostCardSekeleton />
                <PostCardSekeleton />
                <PostCardSekeleton />
              </>
            ) : null}
            {/* posts error state */}
            {isError ? <p>something wents to wrong...</p> : null}
            {/* posts success state */}
            {posts?.length
              ? posts?.map((post) => {
                  return (
                    <PostCard
                      key={post.id}
                      {...post}
                      author={post.author}
                      comments={post.comments}
                      isSaved={post.isSaved}
                    />
                  );
                })
              : "no more posts"}
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
