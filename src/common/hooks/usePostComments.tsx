import { useEffect, useMemo } from "react";
import { useLazyGetPostCommentsQuery } from "../../api/commentsApi";
import { useGetAllUsersQuery } from "../../api/usersApi";
import { CommentDetails } from "../../types/CommentType";

const usePostComments = (postID: string | undefined) => {
  const [getComments, comments] = useLazyGetPostCommentsQuery();
  const users = useGetAllUsersQuery({});

  // trigger get comments details
  useEffect(() => {
    const fetchData = async () => {
      if (postID) {
        try {
          await getComments(postID).unwrap();
        } catch (err) {
          // console.log(err);
        }
      }
    };

    fetchData();
  }, [postID]);

  const commentsData = useMemo(() => {
    let data: CommentDetails[] | undefined = undefined;

    if (
      comments.isSuccess &&
      comments.data &&
      users.isSuccess &&
      users.data &&
      postID
    ) {
      data = [];
      Object.keys(comments.data).forEach((key) => {
        const commentData = comments.data[key];
        const commentAuthor = users.data?.[commentData.authorUID];
        if (!commentAuthor) return;

        // create comment object
        const comment: CommentDetails = {
          comment: commentData,
          author: {
            uid: commentAuthor.uid,
            name: commentAuthor.isDeleted
              ? "Unknown Author"
              : commentAuthor.name,
            avatar: commentAuthor.isDeleted
              ? `https://api.dicebear.com/6.x/shapes/svg?seed=${commentAuthor.uid}`
              : commentAuthor.avatar,
          },
        };
        // push
        data?.push(comment);
      });
    }

    return data;
  }, [comments, users]);

  const isLoading = useMemo(() => {
    let loading = true;
    if (
      (!comments.isLoading && !users.isLoading && commentsData !== undefined) ||
      comments.isError ||
      users.isError
    ) {
      loading = false;
    }
    return loading;
  }, [comments, users, commentsData]);

  const isError = useMemo(() => {
    let error = false;
    if (comments.isError || users.isError) {
      error = true;
    }
    return error;
  }, [comments, users]);

  const error = useMemo(() => {
    let msg = undefined;
    if (comments.error || users.error) {
      msg = comments.error || users.error;
    }
    return msg;
  }, [comments, users]);

  return {
    comments: commentsData,
    isLoading: isLoading,
    isError: isError,
    error: error,
  };
};

export default usePostComments;
