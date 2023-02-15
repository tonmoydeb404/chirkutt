import PostCard from "../common/components/PostCard";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
import usePosts from "../common/hooks/usePosts";

const Home = () => {
  const { posts, isLoading, isError } = usePosts();

  if (isError) {
    return <p>something wents to wrong</p>;
  }

  if (posts && !isLoading) {
    return (
      <div className="flex flex-col gap-3">
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
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <PostCardSekeleton />
      <PostCardSekeleton />
      <PostCardSekeleton />
      <PostCardSekeleton />
    </div>
  );
};

export default Home;
