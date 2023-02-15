import { useMemo } from "react";
import { PostDetailsType } from "../../types/PostType";
import usePosts from "./usePosts";

const useUserPosts = (uid: string | undefined) => {
  const allPosts = usePosts();

  const postsData = useMemo(() => {
    let data: undefined | PostDetailsType[] = undefined;

    if (uid) {
      data = allPosts?.posts?.filter((post) => post.authorUID === uid);
    }

    return data;
  }, [allPosts.posts, uid]);

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

export default useUserPosts;
