import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useUpdatePostMutation } from "../../../../api/postsApi";
import { PostType } from "../../../../types/PostType";
import PostForm from "./PostForm";

const UPDATE_TOAST = "UPDATE_TOAST";

const PostUpdate = ({ post }: { post: PostType }) => {
  const [updatePost, updateResult] = useUpdatePostMutation();

  // post update handler
  const postUpdateHandler = async (text: string) => {
    try {
      const postUpdates = {
        modifiedAt: Date.now(),
        text,
      };
      await updatePost({ id: post.id, updates: postUpdates });
    } catch (error) {
      toast.error("update:something went to wrong! -update", {
        id: UPDATE_TOAST,
      });
    }
  };

  // show toast notification for mutation result
  useEffect(() => {
    if (!updateResult.isUninitialized) {
      if (updateResult.isLoading) {
        toast.loading("updating post", { id: UPDATE_TOAST });
      } else if (updateResult.isSuccess) {
        toast.success("successfully updated post", { id: UPDATE_TOAST });
      } else if (updateResult.isError) {
        toast.error("cannot update post", { id: UPDATE_TOAST });
      }
    }

    return () => {
      updateResult.reset();
    };
  }, [updateResult]);

  return (
    <PostForm
      buttonText="Edit"
      defaultValue={post.text}
      onSubmit={postUpdateHandler}
      title="Edit Post"
    />
  );
};

export default PostUpdate;
