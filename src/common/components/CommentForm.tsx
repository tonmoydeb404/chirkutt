import { nanoid } from "@reduxjs/toolkit";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useCreateCommentMutation } from "../../api/commentsApi";
import { useAddNotificationMutation } from "../../api/notificationsApi";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import iconList from "../../lib/iconList";
import { CommentType } from "../../types/CommentType";
import { NotificationType } from "../../types/NotificationType";
import TextGroup from "./forms/TextGroup";

const CREATE_TOAST = "CREATE_COMMENT_TOAST";
const CommentForm = ({
  postID,
  authorUID,
}: {
  postID: string;
  authorUID: string;
}) => {
  const { user: authUser } = useAppSelector(selectAuth);
  const [createComment, createResult] = useCreateCommentMutation();
  const [createNotification] = useAddNotificationMutation();

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

  // create comment
  const createCommentHandler = async (text: string) => {
    try {
      if (!authUser) throw "user not authorized";
      const newComment: CommentType = {
        id: nanoid(),
        text,
        authorUID: authUser.uid,
        parentID: null,
        postID,
        createdAt: new Date().toISOString(),
      };
      const response = await createComment(newComment);

      return newComment.id;
    } catch (error) {
      return false;
    }
  };
  // create notification handler
  const createNotificationHandler = async (commentID: string) => {
    try {
      if (!authUser) throw Error("user not authorized");
      // don't create notification for the post author own comments
      if (authUser.uid === authorUID) return true;

      const newNotification: NotificationType = {
        id: `${postID}:${authorUID}:${commentID}`,
        eventID: commentID,
        userID: authorUID,
        createdAt: Date.now(),
        path: `/post/${postID}#${commentID}`,
        status: "UNSEEN",
        text: `${authUser.name} is commented on your post`,
        type: "COMMENT",
      };
      const response = await createNotification(newNotification).unwrap();

      return newNotification.id;
    } catch (error) {
      return false;
    }
  };

  // submit handler
  const submitHandler = async (
    { text }: { text: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      const commentID = await createCommentHandler(text);
      if (commentID === false) throw "comment not created";
      const notificationID = await createNotificationHandler(commentID);
      if (notificationID === false) throw "notification not created";
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
