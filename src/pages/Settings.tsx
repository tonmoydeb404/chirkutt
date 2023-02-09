import { Formik } from "formik";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch } from "../app/hooks";
import InputGroup from "../common/components/Forms/InputGroup";
import TextGroup from "../common/components/Forms/TextGroup";
import { useAuth } from "../common/outlet/PrivateOutlet";
import { authSignIn } from "../features/auth/authSlice";
import iconList from "../lib/iconList";
import { useUpdateUserMutation } from "../services/usersApi";

const Settings = () => {
  const [updateUser, result] = useUpdateUserMutation();

  const dispatch = useAppDispatch();
  const auth = useAuth();
  const onSubmitHandler = async ({
    name,
    bio,
  }: {
    name: string;
    bio: string;
  }) => {
    try {
      if (!auth?.user) return;
      const updates: { [key: string]: string } = {};
      if (name !== auth.user.name) updates.name = name;
      if (bio !== auth.user.bio) updates.bio = bio;
      if (Object.keys(updates).length == 0) return;
      // reset previous result
      result.reset();
      // request for update
      const response = await updateUser({
        uid: auth.user.uid,
        updates,
      }).unwrap();

      if (result.isError) throw "something wents to wrong";
      // update auth info
      dispatch(authSignIn(response));
      // reset automatic after some time
      setTimeout(() => {
        if (!result.isError) result.reset();
      }, 10 * 1000);
    } catch (error: any) {
      // console.log(error);
    }
  };

  if (auth?.user?.uid) {
    return (
      <>
        <Formik
          initialValues={{
            name: auth.user.name,
            username: auth.user.username,
            email: auth.user.email,
            bio: auth.user.bio,
          }}
          validationSchema={() =>
            yup.object().shape({
              name: yup.string().min(2).required(),
              bio: yup.string().min(6).max(200),
              email: yup.string().email().required(),
              username: yup.string().min(2).required(),
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
            initialValues,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-5 justify-between">
                <h3 className="text-lg font-medium">Settings</h3>

                <div className="flex items-center gap-1">
                  {initialValues !== values ? (
                    <button className="btn btn-sm btn-primary" type="submit">
                      save <span>{iconList.check}</span>
                    </button>
                  ) : null}
                  <Link
                    to={"/profile"}
                    onClick={() => resetForm()}
                    className="btn btn-sm btn-theme"
                  >
                    cancel
                  </Link>
                </div>
              </div>

              {result.isError ? (
                <p className="p-4 bg-error-600/30 rounded mb-10">
                  {typeof result.error === "string"
                    ? result.error
                    : "something wents to wrong"}
                </p>
              ) : null}
              {result.isLoading ? (
                <p className="p-4 bg-warning-600/30 rounded mb-10">
                  user updating...
                </p>
              ) : null}
              {result.isSuccess ? (
                <p className="p-4 bg-success-600/30 rounded mb-10">
                  successfully updated.
                </p>
              ) : null}

              <div className="flex flex-col gap-3 ">
                <InputGroup
                  label="Name"
                  id="name"
                  containerClass="max-w-full"
                  value={values.name}
                  onChange={handleChange}
                  errorText={errors.name}
                  onBlur={handleBlur}
                />
                <InputGroup
                  label="Username"
                  id="username"
                  containerClass="max-w-full"
                  value={values.username}
                  onChange={handleChange}
                  errorText={errors.username}
                  onBlur={handleBlur}
                  disabled
                  readOnly
                />
                <InputGroup
                  label="Email"
                  id="email"
                  containerClass="max-w-full"
                  value={values.email}
                  onChange={handleChange}
                  errorText={errors.email}
                  onBlur={handleBlur}
                  readOnly
                  disabled
                />
                <TextGroup
                  label="Bio"
                  id="bio"
                  containerClass="max-w-full"
                  value={values.bio}
                  onChange={handleChange}
                  errorText={errors.bio}
                  onBlur={handleBlur}
                />
              </div>
            </form>
          )}
        </Formik>
      </>
    );
  }

  return <p>loading...</p>;
};

export default Settings;
