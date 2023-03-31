import { Formik } from "formik";
import { useState } from "react";
import { Helmet } from "react-helmet";
import * as yup from "yup";
import { useDeleteUserMutation } from "../../api/usersApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import InputGroup from "../../common/components/Forms/InputGroup";
import SettingsHeader from "../../common/components/Settings/SettingsHeader";
import StatusText from "../../common/components/StatusText";
import { authSignOut, selectAuth } from "../../features/auth/authSlice";
import iconList from "../../lib/iconList";

const DeleteAccount = () => {
  const [deleteUser, result] = useDeleteUserMutation();
  const { user } = useAppSelector(selectAuth);
  const [viewPass, setViewPass] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const toggleViewPass = (): void => {
    setViewPass((prevState) => !prevState);
  };

  const deleteAccountHandler = async (password: string) => {
    try {
      if (!user) throw new Error("authorization error");
      const response = await deleteUser({
        email: user.email,
        password,
      }).unwrap();
      if (!response) throw new Error("something wents to wrong!");
      dispatch(authSignOut());
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Delete Account - Chirkutt</title>
      </Helmet>
      <Formik
        enableReinitialize
        initialValues={{
          password: "",
        }}
        validationSchema={() =>
          yup.object().shape({
            password: yup.string().required("password must be provided."),
          })
        }
        onSubmit={async (values) => await deleteAccountHandler(values.password)}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          initialValues,
          isValid,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <SettingsHeader actions={false} title={"Delete Account"} />

            <StatusText
              isLoading={result.isLoading}
              loadingText="deleting your account"
              isError={result.isError}
              errorText={
                (result.error as string) || "something wents to wrong!"
              }
              isSuccess={result.isSuccess}
              successText="successfully deleted account"
            />

            <div className="flex flex-col gap-3">
              <InputGroup
                label="Password"
                id="password"
                containerClass="max-w-full"
                value={values.password}
                onChange={handleChange}
                errorText={errors.password}
                onBlur={handleBlur}
                type={viewPass ? "text" : "password"}
              >
                <button
                  type="button"
                  className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  onClick={toggleViewPass}
                >
                  {viewPass ? iconList.eye : iconList.eye_slash}
                </button>
              </InputGroup>
            </div>

            <div className="mt-5">
              <button
                className="btn btn-error"
                type="submit"
                disabled={!isValid || initialValues === values || isSubmitting}
              >
                Delete Account
              </button>
              <p className="text-sm mt-2 opacity-70">
                by deleteing your account you will lost access from all of your
                existing data
              </p>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default DeleteAccount;
