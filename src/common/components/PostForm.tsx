import { nanoid } from "@reduxjs/toolkit";
import { Formik } from "formik";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { closePostForm, selectPostForm } from "../../features/postFormSlice";
import iconList from "../../lib/iconList";
import { useCreatePostMutation } from "../../services/postsApi";
import { PostType } from "../../types/PostType";
import TextGroup from "./Forms/TextGroup";

const PostForm = () => {
    const { show } = useAppSelector(selectPostForm);
    const { user } = useAppSelector(selectAuth);
    const [createPost, result] = useCreatePostMutation();

    const dispatch = useAppDispatch();

    useEffect(() => {
        // toasts
        if (!result.isUninitialized && result.isLoading) {
            toast.loading("creating new post", { id: "newpost" });
        }
        if (!result.isUninitialized && result.isSuccess) {
            toast.success("successfully created post", { id: "newpost" });
        }
        if (!result.isUninitialized && result.isError) {
            toast.error("cannot create post", { id: "newpost" });
        }

        return () => {
            result.reset();
        };
    }, [result]);

    // close form handler
    const closeForm = () => {
        dispatch(closePostForm());
    };

    // submit handler
    const onSubmitHandler = async (
        { text }: { text: string },
        { resetForm }: { resetForm: () => void }
    ) => {
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

            // reset form state
            resetForm();
            // close form
            closeForm();
        } catch (error) {
            toast.error("something went to wrong");
        }
    };

    return (
        <div
            className={`absolute top-0 left-0 w-full min-h-full bg-neutral-900/60 flex-col items-center justify-center ${
                show ? "flex" : "hidden"
            }`}
        >
            <Formik
                initialValues={{
                    text: "",
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
                                Create new post
                            </h2>

                            <button
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
                                save <span>{iconList.check}</span>
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
