import { useEffect, useMemo } from "react";
import { useLazyGetPostCommentsQuery } from "../../api/commentsApi";
import { useLazyGetPostQuery } from "../../api/postsApi";
import { useLazyGetSavedPostsQuery } from "../../api/savedApi";
import { useLazyGetUserQuery } from "../../api/usersApi";
import { PostDetails } from "../../types/PostType";
import { usePrivateAuth } from "../outlet/PrivateOutlet";

const usePost = (id: string) => {
  const auth = usePrivateAuth();
  const [getPost, post] = useLazyGetPostQuery();
  const [getComments, comments] = useLazyGetPostCommentsQuery();
  const [getAuthor, author] = useLazyGetUserQuery();
  const [getSavedPost, savedPostResult] = useLazyGetSavedPostsQuery();

  // trigger get saved post
  useEffect(() => {
    const fetchSavedPost = async () => {
      if (auth && auth.status === "AUTHORIZED" && auth.user) {
        try {
          await getSavedPost(auth.user.uid).unwrap();
        } catch (err) {
          // console.log(err);
        }
      }
    };

    fetchSavedPost();
  }, [auth]);

  // trigger get post details
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const postRes = await getPost(id).unwrap();
          if (!postRes) throw Error("post not found");
          await getComments(postRes.id).unwrap();
          await getAuthor(postRes.authorUID).unwrap();
        } catch (err) {
          // console.log(err);
        }
      }
    };

    fetchData();
  }, [id]);

  const postData = useMemo(() => {
    let data: undefined | PostDetails = undefined;

    if (post.isSuccess && author.isSuccess && comments.isSuccess && post.data) {
      const isSaved = !!savedPostResult?.data?.[post.data.id];
      data = {
        content: post.data,
        author: {
          name: author.data.isDeleted ? "Unknown Author" : author.data.name,
          uid: author.data.uid,
          avatar: author.data.isDeleted
            ? `https://api.dicebear.com/6.x/shapes/svg?seed=${author.data.uid}`
            : author.data.avatar,
          isDeleted: author.data.isDeleted,
        },
        comments: Object.keys(comments.data),
        isSaved,
      };
    }

    return data;
  }, [post, comments, author, savedPostResult, id]);

  const isLoading = useMemo(() => {
    let loading = true;
    if (
      !post.isLoading &&
      !comments.isLoading &&
      !author.isLoading &&
      postData !== undefined
    ) {
      loading = false;
    }
    return loading;
  }, [post, comments, author, postData, id]);

  const isError = useMemo(() => {
    let error = false;
    if (post.isError || comments.isError || author.isError) {
      error = true;
    }
    return error;
  }, [post, comments, author, id]);

  const error = useMemo(() => {
    let msg = undefined;
    if (post.error || comments.error || author.error) {
      msg = post.error || comments.error || author.error;
    }
    return msg;
  }, [post, comments, author, id]);

  return {
    post: postData,
    comments: comments.data,
    author: author.data,
    isLoading: isLoading,
    isError: isError,
    error: error,
  };
};

export default usePost;
