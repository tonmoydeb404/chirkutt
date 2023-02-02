import PostCard from "../common/components/PostCard";
import { useGetAllPostsQuery } from "../services/postsApi";
import { useGetAllUsersQuery } from "../services/usersApi";

const Home = () => {
  const posts = useGetAllPostsQuery({});
  const users = useGetAllUsersQuery({});

  if (posts.isError || users.isError) {
    return <p>something wents to wrong</p>;
  }

  if (posts.isSuccess && posts.data && users.isSuccess && users.data) {
    return (
      <div className="flex flex-col gap-3">
        {Object.keys(posts.data).length
          ? Object.keys(posts.data).map((key: string) => {
              const post = posts.data[key];
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
