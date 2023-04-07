import { Helmet } from "react-helmet";
import { Navigate, useSearchParams } from "react-router-dom";
import PostCard from "../common/components/post/card/PostCard";
import PostCardSekeleton from "../common/components/skeletons/PostCardSkeleton";
import usePosts from "../common/hooks/usePosts";

const Search = () => {
  const [searchQuery] = useSearchParams();
  const query = searchQuery.get("q");

  if (!query) return <Navigate to={"/"} />;

  const { posts, isLoading, isError } = usePosts();

  return (
    <>
      <Helmet>
        <title>Search - Chirkutt</title>
      </Helmet>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <p className="text-sm opacity-75">showing results for - </p>
          <h4 className="font-semibold">{query}</h4>
        </div>
        {/* post loading state */}
        {isLoading ? (
          <>
            <PostCardSekeleton />
            <PostCardSekeleton />
            <PostCardSekeleton />
          </>
        ) : null}

        {/* post success state */}
        {posts && !isLoading && !isError
          ? posts?.length
            ? posts
                ?.filter((post) =>
                  post.content.text?.toLowerCase().includes(query.toLowerCase())
                )
                .map((post) => {
                  return <PostCard key={post.content.id} {...post} />;
                })
            : "no more posts"
          : null}
      </div>
    </>
  );
};

export default Search;
