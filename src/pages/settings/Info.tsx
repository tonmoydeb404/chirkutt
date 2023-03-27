import { Formik } from "formik";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { BiArrowBack } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch } from "../../app/hooks";
import InputGroup from "../../common/components/Forms/InputGroup";
import TextGroup from "../../common/components/Forms/TextGroup";
import StatusText from "../../common/components/StatusText";
import { usePrivateAuth } from "../../common/outlet/PrivateOutlet";
import { authSignIn } from "../../features/auth/authSlice";
import iconList from "../../lib/iconList";
import {
  useLazyGetUserQuery,
  useUpdateUserMutation,
} from "../../services/usersApi";

const Info = () => {
  const [getUser, user] = useLazyGetUserQuery();
  const [updateUser, result] = useUpdateUserMutation();
  const dispatch = useAppDispatch();
  const auth = usePrivateAuth();
  const navigate = useNavigate();

  // trigger get saved post
  useEffect(() => {
    const fetchUser = async () => {
      if (auth?.user) {
        try {
          await getUser(auth.user.uid).unwrap();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchUser();
  }, [auth]);

  const onSubmitHandler = async ({
    name,
    bio,
  }: {
    name: string;
    bio: string;
  }) => {
    try {
      if (!user.isSuccess || !auth?.user) throw "user not authorized";
      const updates: { [key: string]: string } = {};
      if (name !== user.data.name) updates.name = name;
      if (bio !== user.data.bio) updates.bio = bio;
      if (Object.keys(updates).length == 0) return;
      // reset previous result
      result.reset();
      // request for update
      await updateUser({
        uid: user.data.uid,
        updates,
      }).unwrap();

      if (result.isError) throw "something wents to wrong";

      // update auth info
      dispatch(authSignIn({ ...auth.user, ...updates }));
      // reset automatic after some time
      setTimeout(() => {
        if (!result.isError) result.reset();
      }, 10 * 1000);
    } catch (error: any) {
      // console.log(error);
    }
  };

  if (user.isSuccess) {
    return (
      <>
        <Helmet>
          <title>Edit Info - Chirkutt</title>
        </Helmet>
        <Formik
          initialValues={{
            name: user.data.name,
            email: user.data.email,
            bio: user.data.bio,
          }}
          validationSchema={() =>
            yup.object().shape({
              name: yup.string().min(2).required(),
              bio: yup.string().min(6).max(200),
              email: yup.string().email().required(),
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
              <div className="flex items-center mb-5 gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="text-primary-600"
                >
                  <BiArrowBack />
                </button>
                <h3 className="text-lg font-medium">Edit Info</h3>

                <div className="flex items-center gap-1 ml-auto">
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

              <StatusText
                isLoading={result.isLoading}
                loadingText="updating user info!"
                isError={result.isError}
                errorText="something wents to wrong!"
                isSuccess={result.isSuccess}
                successText="successfully updated user info"
              />

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

export default Info;
