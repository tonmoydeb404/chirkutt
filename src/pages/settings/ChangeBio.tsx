import { Formik } from "formik";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import * as yup from "yup";
import TextGroup from "../../common/components/Forms/TextGroup";
import SettingsHeader from "../../common/components/Settings/SettingsHeader";
import StatusText from "../../common/components/StatusText";
import { usePrivateAuth } from "../../common/outlet/PrivateOutlet";
import {
  useLazyGetUserQuery,
  useUpdateBioMutation,
} from "../../services/usersApi";

const ChangeBio = () => {
  const [getUser, user] = useLazyGetUserQuery();
  const [updateBio, result] = useUpdateBioMutation();
  const auth = usePrivateAuth();

  // trigger to get user info
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

  // update bio
  const submitHandler = async (bio: string) => {
    try {
      if (!auth?.user) throw new Error("user not authorized");
      // reset previous result
      result.reset();
      // update bio
      await updateBio({ uid: auth.user.uid, bio }).unwrap();
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Change Info - Chirkutt</title>
      </Helmet>
      {user.isSuccess ? (
        <Formik
          enableReinitialize
          initialValues={{
            bio: user.data.bio,
          }}
          validationSchema={() =>
            yup.object().shape({
              bio: yup.string().min(6).max(200),
            })
          }
          onSubmit={async (values) => await submitHandler(values.bio)}
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
              <SettingsHeader
                allow={initialValues !== values}
                title={"Change Bio"}
              />

              <StatusText
                isLoading={result.isLoading}
                loadingText="updating user info!"
                isError={result.isError}
                errorText="something wents to wrong!"
                isSuccess={result.isSuccess}
                successText="successfully updated user info"
              />

              <div className="flex flex-col gap-3">
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
      ) : (
        <p>loading...</p>
      )}
    </>
  );
};

export default ChangeBio;
