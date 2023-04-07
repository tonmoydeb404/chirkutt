import { useEffect, useMemo } from "react";
import { useGetAllCommentsQuery } from "../../api/commentsApi";
import { useGetAllPostsQuery } from "../../api/postsApi";
import { useLazyGetSavedPostsQuery } from "../../api/savedApi";
import { useGetAllUsersQuery } from "../../api/usersApi";
import { PostDetails } from "../../types/PostType";
import { usePrivateAuth } from "../outlet/PrivateOutlet";

const usePosts = () => {
  const auth = usePrivateAuth();
  const posts = useGetAllPostsQuery();
  const comments = useGetAllCommentsQuery({});
  const users = useGetAllUsersQuery({});
  const [getSavedPost, savedPostResult] = useLazyGetSavedPostsQuery();

  // trigger get saved post
  useEffect(() => {
    const fetchSavedPost = async () => {
      if (auth && auth.status === "AUTHORIZED" && auth.user) {
        try {
          await getSavedPost(auth.user.uid).unwrap();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchSavedPost();
  }, [auth]);

  const postsData = useMemo(() => {
    let data: undefined | PostDetails[] = undefined;

    if (
      posts.isSuccess &&
      users.isSuccess &&
      comments.isSuccess &&
      typeof posts.data == "object"
    ) {
      // empty array
      data = [];
      Object.keys(posts.data).forEach((key: string) => {
        const postContent = posts?.data[key];
        const postAuthor = users?.data[postContent.authorUID];
        const postComments = Object.keys(comments?.data || {}).filter(
          (c) => comments?.data[c]?.postID === postContent.id
        );
        const isSaved = !!savedPostResult?.data?.[postContent.id];

        // check for author
        if (!postAuthor) return;

        // create post object
        const post: PostDetails = {
          content: postContent,
          author: {
            name: postAuthor.isDeleted ? "Unknown Author" : postAuthor.name,
            uid: postAuthor.uid,
            avatar: postAuthor.isDeleted
              ? `https://api.dicebear.com/6.x/shapes/svg?seed=${postAuthor.uid}`
              : postAuthor.avatar,
            isDeleted: postAuthor.isDeleted,
          },
          comments: postComments,
          isSaved,
        };

        // push data
        data?.push(post);
      });
    }

    return data;
  }, [posts, comments, users, savedPostResult]);

  const isLoading = useMemo(() => {
    let loading = true;
    if (
      !posts.isLoading &&
      !comments.isLoading &&
      !users.isLoading &&
      postsData !== undefined
    ) {
      loading = false;
    }
    return loading;
  }, [posts, comments, users, postsData]);

  const isError = useMemo(() => {
    let error = false;
    if (posts.isError || comments.isError || users.isError) {
      error = true;
    }
    return error;
  }, [posts, comments, users]);

  const error = useMemo(() => {
    let msg = undefined;
    if (posts.error || comments.error || users.error) {
      msg = posts.error || comments.error || users.error;
    }
    return msg;
  }, [posts, comments, users]);

  return {
    posts: postsData,
    isLoading: isLoading,
    isError: isError,
    error: error,
  };
};

export default usePosts;
