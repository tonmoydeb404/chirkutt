import { useAppDispatch, useAppSelector } from "../app/hooks";
import PostCard from "../common/components/PostCard";
import { selectAuth } from "../features/auth/authSlice";
import { openPostForm } from "../features/postFormSlice";
import iconList from "../lib/iconList";
import { useGetAllPostsQuery } from "../services/postsApi";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector(selectAuth);
  const { data, isLoading, isError, isSuccess } = useGetAllPostsQuery({});

  if (status === "AUTHORIZED" && user) {
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
              {user.bio ? (
                <p className="text-sm w-full">{user.bio}</p>
              ) : (
                <span className="opacity-50 inline-flex gap-0.5 items-center text-xs">
                  {iconList.pencil}
                  edit your bio from settings
                </span>
              )}

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

              <button
                className="btn btn-sm btn-primary"
                onClick={() => dispatch(openPostForm())}
              >
                add new <span>{iconList.add}</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-3">
              {isLoading ? <p>loading...</p> : null}
              {isError ? <p>something wents to wrong...</p> : null}
              {data && isSuccess && Object.keys(data).length
                ? Object.keys(data).map((key: string) => {
                    const post = data[key];
                    return post.authorUID === user.uid ? (
                      <PostCard key={post.id} {...post} author={user} />
                    ) : null;
                  })
                : "no more posts"}
            </div>
          </div>
        </div>
      </>
    );
  }

  return <p>loading</p>;
};

export default Profile;
