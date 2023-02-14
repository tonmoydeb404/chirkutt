import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { BiCopyAlt } from "react-icons/bi";
import { useAppDispatch } from "../app/hooks";
import PostCard from "../common/components/PostCard";
import StatCard from "../common/components/StatCard";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
import ProfileCardSkeleton from "../common/components/skeletons/ProfileCardSkeleton";
import StatCardSkeleton from "../common/components/skeletons/StatCardSkeleton";
import { useAuth } from "../common/outlet/PrivateOutlet";
import { openPostForm } from "../features/postFormSlice";
import iconList from "../lib/iconList";
import { useGetAllCommentsQuery } from "../services/commentsApi";
import { useGetAllPostsQuery } from "../services/postsApi";
import { useLazyGetSavedPostsQuery } from "../services/savedApi";
import { useLazyGetUserQuery } from "../services/usersApi";

const Profile = () => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const posts = useGetAllPostsQuery();
  const comments = useGetAllCommentsQuery({});
  const [getUser, user] = useLazyGetUserQuery();

  const [getSavedPost, savedPostResult] = useLazyGetSavedPostsQuery();

  // trigger get saved post
  useEffect(() => {
    const fetchSavedPost = async () => {
      if (auth?.user) {
        try {
          await getSavedPost(auth.user.uid).unwrap();
          await getUser(auth.user.uid).unwrap();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchSavedPost();
  }, [auth]);

  return (
    <>
      <Helmet>
        <title>Profile - Chirkutt</title>
      </Helmet>
      <div className="flex flex-col">
        {user.isSuccess && user.data ? (
          <div className="flex flex-col sm:flex-row items-start gap-3 box p-3 sm:p-4 rounded">
            <img
              src={user.data?.avatar}
              alt={user.data?.name}
              className="w-[60px] rounded"
            />

            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{user.data?.name}</h2>
                <span>-</span>
                <span
                  title="copy profile link"
                  className="text-primary-600 text-sm hover:text-primary-700 cursor-copy"
                >
                  <BiCopyAlt />
                </span>
              </div>
              {user.data?.bio ? (
                <p className="text-sm w-full">{user.data?.bio}</p>
              ) : (
                <span className="opacity-50 inline-flex gap-0.5 items-center text-xs">
                  {iconList.pencil}
                  edit your bio from settings
                </span>
              )}

              <div className="flex items-center gap-1 mt-3">
                <a
                  href={`mailto:${user.data?.email}`}
                  target={"_blank"}
                  className="btn btn-sm btn-theme ml-auto"
                >
                  {iconList.email}
                  email
                </a>
              </div>
            </div>
          </div>
        ) : null}
        {user.isLoading || !user.data ? <ProfileCardSkeleton /> : null}

        {user.isSuccess && user.data ? (
          <div className="grid min-[500px]:grid-cols-2 sm:grid-cols-3 mt-2 gap-2">
            <StatCard
              icon="post"
              color="primary"
              title="chirkutts"
              count={100}
            />
            <StatCard icon="like" color="success" title="likes" count={200} />
            <StatCard
              icon="comment"
              color="warning"
              title="comments"
              count={100}
            />
          </div>
        ) : null}

        {user.isLoading || !user.data ? (
          <div className="grid min-[500px]:grid-cols-2 sm:grid-cols-3 mt-2 gap-2">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : null}

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Recent Posts</h3>

            <button
              className="btn btn-sm btn-primary"
              onClick={() => dispatch(openPostForm({ type: "CREATE" }))}
            >
              add new <span>{iconList.add}</span>
            </button>
          </div>

          <div className="flex flex-col gap-3 mt-3">
            {posts.isLoading || !user.data ? (
              <>
                <PostCardSekeleton />
                <PostCardSekeleton />
                <PostCardSekeleton />
              </>
            ) : null}
            {posts.isError ? <p>something wents to wrong...</p> : null}
            {posts.data &&
            posts.isSuccess &&
            comments.data &&
            comments.isSuccess &&
            Object.keys(posts.data).length
              ? Object.keys(posts.data).map((key: string) => {
                  const post = posts.data[key];
                  const postComments = Object.keys(comments.data).filter(
                    (c) => comments.data[c].postID === post.id
                  );
                  const isSaved = !!savedPostResult?.data?.[post.id];
                  return post.authorUID === user.data?.uid ? (
                    <PostCard
                      key={post.id}
                      {...post}
                      author={user.data}
                      comments={postComments.length}
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
};

export default Profile;
