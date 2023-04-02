import { nanoid } from "@reduxjs/toolkit";
import { Form, Formik } from "formik";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useCreateCommentMutation } from "../../../api/commentsApi";
import { useAddNotificationMutation } from "../../../api/notificationsApi";
import { useAppSelector } from "../../../app/hooks";
import { selectAuth } from "../../../features/auth/authSlice";
import iconList from "../../../lib/iconList";
import { AuthUserType } from "../../../types/AuthType";
import { Comment } from "../../../types/CommentType";
import { NotificationType } from "../../../types/NotificationType";

type CommentReplayFormProps = {
  postAuthorUID: string;
  commentAuthorUID: string;
  postID: string;
  parentID: string;
};

const CommentReplayForm = ({
  postID,
  parentID,
  commentAuthorUID,
  postAuthorUID,
}: CommentReplayFormProps) => {
  const { user: authUser } = useAppSelector(selectAuth);
  const [createComment] = useCreateCommentMutation();
  const [createNotification] = useAddNotificationMutation();

  // create a reply
  const createReplyHandler = async (text: string, replayAuthor: AuthUserType) =>
    new Promise<string>(async (resolve, reject) => {
      try {
        const newReply: Comment = {
          id: nanoid(),
          text,
          authorUID: replayAuthor.uid,
          parentID,
          postID,
          createdAt: Date.now(),
        };
        const response = await createComment(newReply);
        resolve(newReply.id);
      } catch (error) {
        reject(error);
      }
    });
  // create notifications for reply
  const createNotificationHandler = async (
    replayID: string,
    replayAuthor: AuthUserType
  ) =>
    new Promise<boolean>(async (resolve, reject) => {
      try {
        const promises: Promise<boolean | undefined>[] = [];
        // don't create notification for the post author own reply
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
          promises.push(createNotification(postAuthorNotification).unwrap());
        }
        // don't create notification for the comment author own reply or for own post
        if (
          replayAuthor.uid !== commentAuthorUID ||
          commentAuthorUID !== postAuthorUID
        ) {
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
          promises.push(createNotification(commentAuthorNotification).unwrap());
        }
        await Promise.all(promises);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  // submit handler
  const submitHandler = async (
    { replay }: { replay: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      if (!authUser) throw "authentication failed";
      const replayID = await createReplyHandler(replay, authUser);
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

export default CommentReplayForm;
