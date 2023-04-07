import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useLazyGetUserQuery } from "../api/usersApi";
import ProfileCard from "../common/components/ProfileCard";
import PostCard from "../common/components/post/card/PostCard";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
import ProfileCardSkeleton from "../common/components/skeletons/ProfileCardSkeleton";
import useUserPosts from "../common/hooks/useUserPosts";
import { usePrivateAuth } from "../common/outlet/PrivateOutlet";

const User = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  // navigate to error page
  if (!uid) return <Navigate to={"/404"}></Navigate>;
  const auth = usePrivateAuth();
  const [getUser, user] = useLazyGetUserQuery();
  const { posts, isLoading, isError } = useUserPosts(uid);

  // trigger get user
  useEffect(() => {
    const fetchUser = async () => {
      if (uid) {
        try {
          const response = await getUser(uid).unwrap();
          if (response?.isDeleted) throw new Error("user is deleted");
        } catch (err) {
          // console.log(err);
          navigate("/404");
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
                  return <PostCard key={post.content.id} {...post} />;
                })
              : "no more posts"}
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
