import { Helmet } from "react-helmet";
import PostCard from "../common/components/post/card/PostCard";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
import EmptyState from "../common/components/state/EmptyState";
import ErrorState from "../common/components/state/ErrorState";
import useSavedPosts from "../common/hooks/useSavedPosts";
import { usePrivateAuth } from "../common/outlet/PrivateOutlet";

const Saved = () => {
  const auth = usePrivateAuth();
  const { posts, isLoading, isError } = useSavedPosts();

  return (
    <>
      <Helmet>
        <title>Saved Posts - Chirkutt</title>
      </Helmet>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Saved Posts</h3>
        </div>

        <div className="flex flex-col gap-3 mt-5">
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
            <EmptyState text="nothing is saved" />
          )}
        </div>
      </div>
    </>
  );
};

export default Saved;
