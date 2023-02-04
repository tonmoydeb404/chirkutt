import { nanoid } from "@reduxjs/toolkit";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import iconList from "../../lib/iconList";
import { useCreateCommentMutation } from "../../services/commentsApi";
import { CommentType } from "../../types/CommentType";

const ReplayForm = ({
  postID,
  parentID,
}: {
  postID: string;
  parentID: string;
}) => {
  const { user: authUser } = useAppSelector(selectAuth);
  const [createComment, createResult] = useCreateCommentMutation();

  // submit handler
  const submitHandler = async (
    { replay }: { replay: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      if (!authUser) throw Error("authentication failed");
      const newComment: CommentType = {
        id: nanoid(),
        text: replay,
        authorUID: authUser.uid,
        parentID,
        postID,
        createdAt: new Date().toISOString(),
      };
      await createComment(newComment);
    } catch (error) {
      toast.error("something went to wrong!");
    }
    // reset form state
    resetForm();
  };

  return authUser ? (
    <>
      <Formik
        initialValues={{ replay: "" }}
        onSubmit={submitHandler}
        validationSchema={() =>
          yup.object().shape({
            replay: yup.string().min(1).max(500).required(),
          })
        }
        className="flex-1 flex flex-col gap-2"
      >
        {({ values, errors, handleChange, handleBlur }) => (
          <Form className="comments_thread_form">
            <img
              src={authUser.avatar}
              alt={authUser.name}
              className="rounded"
            />
            <input
              name="replay"
              type="text"
              placeholder="leave a reply"
              value={values.replay}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button className="btn btn-icon btn-sm btn-theme" type="submit">
              {iconList.send}
            </button>
          </Form>
        )}
      </Formik>
    </>
  ) : null;
};

export default ReplayForm;
