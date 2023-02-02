import { nanoid } from "@reduxjs/toolkit";
import { Formik } from "formik";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { closePostForm, selectPostForm } from "../../features/postFormSlice";
import iconList from "../../lib/iconList";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "../../services/postsApi";
import { PostType } from "../../types/PostType";
import TextGroup from "./Forms/TextGroup";

const UPDATE_TOAST = "updateResult";
const CREATE_TOAST = "createResult";

const PostForm = () => {
  const { show, defaultValue, type } = useAppSelector(selectPostForm);
  const { user } = useAppSelector(selectAuth);
  const [createPost, createResult] = useCreatePostMutation();
  const [updatePost, updateResult] = useUpdatePostMutation();

  const dispatch = useAppDispatch();

  // manipulate dom on popup
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", show);
  }, [show]);

  // show toast notification for mutation result
  useEffect(() => {
    // create toasts
    if (!createResult.isUninitialized) {
      if (createResult.isLoading) {
        toast.loading("creating new post", { id: CREATE_TOAST });
      } else if (createResult.isSuccess) {
        toast.success("successfully created post", { id: CREATE_TOAST });
      } else if (createResult.isError) {
        toast.error("cannot create post", { id: CREATE_TOAST });
      }
    }

    // update toasts
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
      createResult.reset();
      updateResult.reset();
    };
  }, [createResult, updateResult]);

  // close form handler
  const closeForm = () => {
    dispatch(closePostForm());
  };
  // post create handler
  const postCreateHandler = async (text: string) => {
    try {
      const newPost: PostType = {
        id: nanoid(),
        text,
        createdAt: new Date().toISOString(),
        modifiedAt: null,
        likes: [],
        authorUID: user.uid,
      };
      await createPost(newPost);
    } catch (error) {
      toast.error("something went to wrong! -create", { id: "CREATE_TOAST" });
    }
  };
  // post update handler
  const postUpdateHandler = async (text: string, id: string) => {
    try {
      const postUpdates = {
        modifiedAt: new Date().toISOString(),
        text,
      };
      await updatePost({ id, updates: postUpdates });
    } catch (error) {
      toast.error("update:something went to wrong! -update", {
        id: UPDATE_TOAST,
      });
    }
  };
  // submit handler
  const onSubmitHandler = async (
    { text }: { text: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    if (type === "EDIT" && defaultValue?.id) {
      await postUpdateHandler(text, defaultValue.id);
    } else {
      await postCreateHandler(text);
    }
    // reset form state
    resetForm();
    // close form
    closeForm();
  };

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full min-h-full bg-neutral-900/60 flex-col items-center justify-center ${
        show ? "flex" : "hidden"
      }`}
    >
      <Formik
        enableReinitialize
        initialValues={{
          text: defaultValue?.text || "",
        }}
        validationSchema={() =>
          yup.object().shape({
            text: yup.string().min(1).max(500).required(),
          })
        }
        onSubmit={onSubmitHandler}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          resetForm,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col rounded box w-full flex-1 min-[501px]:flex-none min-[501px]:w-[400px] py-3 px-4 gap-3"
          >
            <div className="flex items-center">
              <h2 className="font-medium mr-auto text-lg">
                {type == "CREATE" ? "Create new post" : "Update post"}
              </h2>

              <button
                type="button"
                className="btn-icon btn-sm btn-ghost text-lg"
                onClick={() => dispatch(closePostForm())}
              >
                {iconList.close}
              </button>
            </div>
            <div className="">
              <TextGroup
                id="newpost"
                placeholder="share your chirkutt"
                inputClass="h-[150px] bg-neutral-900"
                name="text"
                value={values.text}
                onChange={handleChange}
                errorText={errors.text}
                onBlur={handleBlur}
              />
            </div>
            <div className="flex items-center justify-end gap-1">
              <button className="btn btn-primary" type="submit">
                {type === "EDIT" ? "update" : "save"}{" "}
                <span>{iconList[type === "EDIT" ? "pencil" : "check"]}</span>
              </button>
              <button
                type="button"
                className="btn btn-theme"
                onClick={() => {
                  closeForm();
                  resetForm();
                }}
              >
                cancel
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default PostForm;
