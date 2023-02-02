import PostCard from "../common/components/PostCard";
import { useGetAllPostsQuery } from "../services/postsApi";
import { useGetAllUsersQuery } from "../services/usersApi";

const Home = () => {
  const { data, isLoading, isError, error, isSuccess } = useGetAllPostsQuery(
    {}
  );
  const users = useGetAllUsersQuery({});

  if (isError || users.isError) {
    return <p>something wents to wrong</p>;
  }

  if (isSuccess && users.isSuccess) {
    return (
      <div className="flex flex-col gap-3">
        {Object.keys(data).length
          ? Object.keys(data).map((key: string) => {
              const post = data[key];
              const author = users.data[post.authorUID];
              return <PostCard key={post.id} {...post} author={author} />;
            })
          : "no more posts"}
      </div>
    );
  }

  return <p>loading...</p>;
};

export default Home;
