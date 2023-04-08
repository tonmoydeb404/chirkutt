import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useLazyGetUserQuery } from "../api/usersApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PostCard from "../common/components/post/card/PostCard";
import ProfileCard from "../common/components/profile/card/ProfileCard";
import ProfileStat from "../common/components/profile/stat/ProfileStat";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
import ProfileCardSkeleton from "../common/components/skeletons/ProfileCardSkeleton";
import StatCardSkeleton from "../common/components/skeletons/StatCardSkeleton";
import EmptyState from "../common/components/state/EmptyState";
import ErrorState from "../common/components/state/ErrorState";
import useUserPosts from "../common/hooks/useUserPosts";
import { selectAuth } from "../features/auth/authSlice";
import { createPostModal } from "../features/postModal/postModalSlice";
import iconList from "../lib/iconList";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user: authUser } = useAppSelector(selectAuth);
  const [getUser, user] = useLazyGetUserQuery();
  const { posts, isLoading, isError } = useUserPosts(authUser?.uid);

  // trigger get user
  useEffect(() => {
    const fetchUser = async () => {
      if (authUser) {
        try {
          await getUser(authUser.uid).unwrap();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchUser();
  }, [authUser]);

  // likes
  const likes = useMemo(() => {
    const like = posts?.length
      ? posts.reduce((prev, current) => {
          return prev + current.content.likes.length;
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
            <ProfileStat
              icon="post"
              color="primary"
              title="chirkutts"
              count={posts?.length || 0}
            />
            <ProfileStat
              icon="like"
              color="success"
              title="likes"
              count={likes}
            />
            <ProfileStat
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

            {user.isSuccess && authUser?.uid === user.data.uid ? (
              <button
                className="btn btn-sm btn-primary"
                onClick={() => dispatch(createPostModal())}
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
            {isError ? <ErrorState /> : null}
            {/* posts success state */}
            {posts?.length ? (
              posts?.map((post) => {
                return <PostCard key={post.content.id} {...post} />;
              })
            ) : (
              <EmptyState text="no recent posts" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
