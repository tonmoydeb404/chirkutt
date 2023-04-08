import { Helmet } from "react-helmet";
import PostCard from "../common/components/post/card/PostCard";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
import EmptyState from "../common/components/state/EmptyState";
import ErrorState from "../common/components/state/ErrorState";
import usePosts from "../common/hooks/usePosts";

const Home = () => {
  const { posts, isLoading, isError, error } = usePosts();

  return (
    <>
      <Helmet>
        <title>Home - Chirkutt</title>
      </Helmet>
      {!isLoading && !isError && posts instanceof Array ? (
        <div className="flex flex-col gap-3">
          {posts.length ? (
            posts?.map((post) => {
              return <PostCard key={post.content.id} {...post} />;
            })
          ) : (
            <EmptyState text="there is no chirkutts" />
          )}
        </div>
      ) : null}
      {isError ? <ErrorState /> : null}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <PostCardSekeleton />
          <PostCardSekeleton />
          <PostCardSekeleton />
          <PostCardSekeleton />
        </div>
      ) : null}
    </>
  );
};

export default Home;
