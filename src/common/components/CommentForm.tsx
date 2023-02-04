import { nanoid } from "@reduxjs/toolkit";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import iconList from "../../lib/iconList";
import { useCreateCommentMutation } from "../../services/commentsApi";
import { CommentType } from "../../types/CommentType";
import TextGroup from "./Forms/TextGroup";

const CREATE_TOAST = "CREATE_COMMENT_TOAST";
const CommentForm = ({ postID }: { postID: string }) => {
  const { user: authUser } = useAppSelector(selectAuth);
  const [createComment, createResult] = useCreateCommentMutation();

  // show toast notification for mutation result
  useEffect(() => {
    // create toasts
    if (!createResult.isUninitialized) {
      if (createResult.isLoading) {
        toast.loading("submitting new comment", { id: CREATE_TOAST });
      } else if (createResult.isSuccess) {
        toast.success("successfully submitted comment", { id: CREATE_TOAST });
      } else if (createResult.isError) {
        toast.error("cannot submit comment", { id: CREATE_TOAST });
      }
    }

    return () => {
      createResult.reset();
    };
  }, [createResult]);

  // submit handler
  const submitHandler = async (
    { text }: { text: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      if (!authUser) throw Error("authentication failed");
      const newComment: CommentType = {
        id: nanoid(),
        text,
        authorUID: authUser.uid,
        parentID: null,
        postID,
        createdAt: new Date().toISOString(),
      };
      await createComment(newComment);
    } catch (error) {
      toast.error("something went to wrong!", { id: CREATE_TOAST });
    }
    // reset form state
    resetForm();
  };

  return authUser ? (
    <>
      <div className="flex items-center justify-between mt-10">
        <h3 className="">Write a comments</h3>
      </div>

      <div className="mt-3 flex gap-2 rounded">
        <img
          src={authUser.avatar}
          alt={authUser.name}
          className="w-[35px] h-[35px] rounded hidden min-[501px]:block"
        />
        <Formik
          initialValues={{ text: "" }}
          onSubmit={submitHandler}
          validationSchema={() =>
            yup.object().shape({
              text: yup.string().min(1).max(500).required(),
            })
          }
          className="flex-1 flex flex-col gap-2"
        >
          {({ values, errors, handleChange, handleBlur }) => (
            <Form className="flex-1 flex flex-col gap-2">
              <TextGroup
                id="new_comment"
                name="text"
                value={values.text}
                onChange={handleChange}
                onBlur={handleBlur}
                errorText={errors.text}
                placeholder="write your comment"
              />
              <button className="btn btn-sm btn-primary self-end" type="submit">
                submit <span>{iconList.check}</span>
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  ) : null;
};

export default CommentForm;
