import { Helmet } from "react-helmet";
import PostCard from "../common/components/PostCard";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
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
    </>
  );
};

export default Saved;
