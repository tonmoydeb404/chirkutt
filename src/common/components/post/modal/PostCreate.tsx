import { nanoid } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useCreatePostMutation } from "../../../../api/postsApi";
import { useAppSelector } from "../../../../app/hooks";
import { selectAuth } from "../../../../features/auth/authSlice";
import { PostType } from "../../../../types/PostType";
import PostForm from "./PostForm";

const CREATE_TOAST = "CREATE_TOAST";

const PostCreate = () => {
  const [createPost, createResult] = useCreatePostMutation();
  const { user } = useAppSelector(selectAuth);

  // post create handler
  const postCreateHandler = async (text: string) => {
    try {
      if (!user) throw Error("authentication failed");
      const newPost: PostType = {
        id: nanoid(),
        text,
        createdAt: Date.now(),
        modifiedAt: null,
        likes: [],
        authorUID: user.uid,
      };
      await createPost(newPost);
    } catch (error) {
      console.log(error);

      toast.error("something wents to wrong!", { id: CREATE_TOAST });
    }
  };

  // show toast notification for mutation result
  useEffect(() => {
    if (!createResult.isUninitialized) {
      if (createResult.isLoading) {
        toast.loading("creating new post", { id: CREATE_TOAST });
      } else if (createResult.isSuccess) {
        toast.success("successfully created post", { id: CREATE_TOAST });
      } else if (createResult.isError) {
        toast.error("cannot create post", { id: CREATE_TOAST });
      }
    }

    return () => {
      createResult.reset();
    };
  }, [createResult]);

  return (
    <PostForm
      title="Create Post"
      buttonText="Create"
      defaultValue=""
      onSubmit={postCreateHandler}
    />
  );
};

export default PostCreate;
