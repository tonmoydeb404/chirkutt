import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useAppDispatch } from "../app/hooks";
import PostCard from "../common/components/PostCard";
import ProfileCard from "../common/components/ProfileCard";
import StatCard from "../common/components/StatCard";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
import ProfileCardSkeleton from "../common/components/skeletons/ProfileCardSkeleton";
import StatCardSkeleton from "../common/components/skeletons/StatCardSkeleton";
import useUserPosts from "../common/hooks/useUserPosts";
import { usePrivateAuth } from "../common/outlet/PrivateOutlet";
import { openPostForm } from "../features/postFormSlice";
import iconList from "../lib/iconList";
import { useLazyGetUserQuery } from "../services/usersApi";

const Profile = () => {
  const dispatch = useAppDispatch();
  const auth = usePrivateAuth();
  const [getUser, user] = useLazyGetUserQuery();
  const { posts, isLoading, isError } = useUserPosts(auth?.user?.uid);

  // trigger get user
  useEffect(() => {
    const fetchUser = async () => {
      if (auth?.user) {
        try {
          await getUser(auth.user.uid).unwrap();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchUser();
  }, [auth]);

  // likes
  const likes = useMemo(() => {
    const like = posts?.length
      ? posts.reduce((prev, current) => {
          return prev + current.likes.length;
        }, 0)
      : 0;

    return like;
  }, [posts]);

  // comments
  const comments = useMemo(() => {
    const comment = posts?.length
      ? posts.reduce((prev, current) => {
          return prev + current.comments.length;
        }, 0)
      : 0;

    return comment;
  }, [posts]);

  return (
    <>
      <Helmet>
        <title>Profile - Chirkutt</title>
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

        {/* user stats data state */}
        {user.isSuccess && user.data ? (
          <div className="grid min-[500px]:grid-cols-2 sm:grid-cols-3 mt-2 gap-2">
            <StatCard
              icon="post"
              color="primary"
              title="chirkutts"
              count={posts?.length || 0}
            />
            <StatCard icon="like" color="success" title="likes" count={likes} />
            <StatCard
              icon="comment"
              color="warning"
              title="comments"
              count={comments}
            />
          </div>
        ) : null}
        {/* user stats loading state */}
        {(user.isLoading || !user.data) && !user.isError ? (
          <div className="grid min-[500px]:grid-cols-2 sm:grid-cols-3 mt-2 gap-2">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : null}

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Recent Posts</h3>

            {user.isSuccess && auth?.user?.uid === user.data.uid ? (
              <button
                className="btn btn-sm btn-primary"
                onClick={() => dispatch(openPostForm({ type: "CREATE" }))}
              >
                add new <span>{iconList.add}</span>
              </button>
            ) : null}
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

export default Profile;
