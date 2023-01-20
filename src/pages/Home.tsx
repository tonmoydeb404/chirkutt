import PostCard from "../common/components/PostCard";
import { useGetAllPostsQuery } from "../services/postsApi";

const Home = () => {
    const { data, isLoading, isError, error, isSuccess } = useGetAllPostsQuery(
        {}
    );

    if (!data && isError) {
        return <p>something wents to wrong</p>;
    }

    if (data && isSuccess) {
        return (
            <div className="flex flex-col gap-2">
                {Object.keys(data).length
                    ? Object.keys(data).map((key: string) => {
                          const post = data[key];
                          return <PostCard key={post.id} {...post} />;
                      })
                    : "no more posts"}
            </div>
        );
    }

    return <p>loading...</p>;
};

export default Home;
