import { nanoid } from "@reduxjs/toolkit";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import iconList from "../../lib/iconList";
import { useCreateCommentMutation } from "../../services/commentsApi";
import { useAddNotificationMutation } from "../../services/notificationsApi";
import { CommentType } from "../../types/CommentType";
import { NotificationType } from "../../types/NotificationType";
import { UserType } from "../../types/UserType";

const ReplayForm = ({
  postID,
  parentID,
  commentAuthorUID,
  postAuthorUID,
}: {
  postAuthorUID: string;
  commentAuthorUID: string;
  postID: string;
  parentID: string;
}) => {
  const { user: authUser } = useAppSelector(selectAuth);
  const [createComment] = useCreateCommentMutation();
  const [createNotification] = useAddNotificationMutation();

  // create comment
  const createCommentHandler = async (text: string, replayAuthor: UserType) => {
    try {
      const newComment: CommentType = {
        id: nanoid(),
        text,
        authorUID: replayAuthor.uid,
        parentID,
        postID,
        createdAt: Date.now(),
      };
      const response = await createComment(newComment);

      return newComment.id;
    } catch (error) {
      return false;
    }
  };
  // create notification handler
  const createNotificationHandler = async (
    replayID: string,
    replayAuthor: UserType
  ) => {
    try {
      // don't create notification for the post author own comments
      if (replayAuthor.uid !== postAuthorUID) {
        const postAuthorNotification: NotificationType = {
          id: `${postID}:${postAuthorUID}:${replayID}`,
          eventID: replayID,
          userID: postAuthorUID,
          createdAt: Date.now(),
          path: `/post/${postID}#${replayID}`,
          status: "UNSEEN",
          text: `${replayAuthor.name} replied to a comment on your post`,
          type: "COMMENT",
        };
        await createNotification(postAuthorNotification).unwrap();
      }
      // don't create notification for the comment author own comments
      if (replayAuthor.uid !== commentAuthorUID) {
        const commentAuthorNotification: NotificationType = {
          id: `${postID}:${commentAuthorUID}:${replayID}`,
          eventID: replayID,
          userID: commentAuthorUID,
          createdAt: Date.now(),
          path: `/post/${postID}#${replayID}`,
          status: "UNSEEN",
          text: `${replayAuthor.name} replied to your comment`,
          type: "COMMENT",
        };
        await createNotification(commentAuthorNotification).unwrap();
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  // submit handler
  const submitHandler = async (
    { replay }: { replay: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      if (!authUser) throw "authentication failed";
      const replayID = await createCommentHandler(replay, authUser);
      if (replayID === false) throw "error: cannot create replay";
      await createNotificationHandler(replayID, authUser);
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
