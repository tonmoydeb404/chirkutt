import { Formik } from "formik";
import { useState } from "react";
import { Helmet } from "react-helmet";
import * as yup from "yup";
import { useUpdatePasswordMutation } from "../../api/usersApi";
import { useAppSelector } from "../../app/hooks";
import StatusText from "../../common/components/StatusText";
import InputGroup from "../../common/components/forms/InputGroup";
import SettingsHeader from "../../common/components/settings/SettingsHeader";
import { selectAuth } from "../../features/auth/authSlice";
import iconList from "../../lib/iconList";

const ChangePassword = () => {
  const [updatePassword, result] = useUpdatePasswordMutation();
  const { user } = useAppSelector(selectAuth);
  const [viewPass, setViewPass] = useState<boolean>(false);
  const toggleViewPass = (): void => {
    setViewPass((prevState) => !prevState);
  };

  const updatePasswordHandler = async (
    old_password: string,
    new_password: string
  ) => {
    try {
      if (!user) throw new Error("authorization error");
      const response = await updatePassword({
        email: user.email,
        password: old_password,
        new_password,
      }).unwrap();
      if (!response) throw new Error("something wents to wrong!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Change Password - Chirkutt</title>
      </Helmet>
      <Formik
        enableReinitialize
        initialValues={{
          old_password: "",
          new_password: "",
          confirm_password: "",
        }}
        validationSchema={() =>
          yup.object().shape({
            old_password: yup
              .string()
              .required("Old password must be provided."),
            new_password: yup
              .string()
              .required("new password must be provided.")
              .min(8, "Password is too short - should be 8 chars minimum."),
            confirm_password: yup
              .string()
              .required("you must confirm password")
              .oneOf([yup.ref("new_password"), null], "Passwords must match"),
          })
        }
        onSubmit={async (values) =>
          await updatePasswordHandler(values.old_password, values.new_password)
        }
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
            <SettingsHeader
              allow={isValid && initialValues !== values && !isSubmitting}
              title={"Change Password"}
            />

            <StatusText
              isLoading={result.isLoading}
              loadingText="updating password"
              isError={result.isError}
              errorText={
                (result.error as string) || "something wents to wrong!"
              }
              isSuccess={result.isSuccess}
              successText="successfully changed password"
            />

            <div className="flex flex-col gap-3">
              <InputGroup
                label="Old Password"
                id="old_password"
                containerClass="max-w-full"
                value={values.old_password}
                onChange={handleChange}
                errorText={errors.old_password}
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
              <InputGroup
                label="New Password"
                id="new_password"
                containerClass="max-w-full"
                value={values.new_password}
                onChange={handleChange}
                errorText={errors.new_password}
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
              <InputGroup
                label="Confirm New Password"
                id="confirm_password"
                containerClass="max-w-full"
                value={values.confirm_password}
                onChange={handleChange}
                errorText={errors.confirm_password}
                onBlur={handleBlur}
                type={viewPass ? "text" : "password"}
              />
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ChangePassword;
