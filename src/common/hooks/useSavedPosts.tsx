import { useMemo } from "react";
import { PostDetailsType } from "../../types/PostType";
import usePosts from "./usePosts";

const useSavedPosts = () => {
  const allPosts = usePosts();

  const postsData = useMemo(() => {
    let data: undefined | PostDetailsType[] = undefined;

    if (allPosts.posts) {
      data = allPosts?.posts?.filter((post) => post.isSaved);
    }

    return data;
  }, [allPosts.posts]);

  const isLoading = useMemo(() => {
    let loading = true;
    if (!allPosts.isLoading && postsData !== undefined) {
      loading = false;
    }
    return loading;
  }, [allPosts.isLoading, postsData]);

  return {
    posts: postsData,
    isLoading: isLoading,
    isError: allPosts.isError,
    error: allPosts.error,
  };
};

export default useSavedPosts;
