import { Formik } from "formik";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import * as yup from "yup";
import { useLazyGetUserQuery, useUpdateNameMutation } from "../../api/usersApi";
import { useAppDispatch } from "../../app/hooks";
import SettingsHeader from "../../common/components/Settings/SettingsHeader";
import StatusText from "../../common/components/StatusText";
import InputGroup from "../../common/components/forms/InputGroup";
import { usePrivateAuth } from "../../common/outlet/PrivateOutlet";
import { authSignIn } from "../../features/auth/authSlice";

const ChangeName = () => {
  const [getUser, user] = useLazyGetUserQuery();
  const [updateName, result] = useUpdateNameMutation();
  const auth = usePrivateAuth();
  const dispatch = useAppDispatch();

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

  // update name handler
  const submitHandler = async (name: string) => {
    try {
      if (!auth?.user) throw new Error("user not authorized");
      // reset previous result
      result.reset();
      // update name request
      const response = await updateName({ uid: auth.user.uid, name }).unwrap();
      if (!response) throw new Error("something wents to wrong");
      dispatch(authSignIn(response));
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Change Name - Chirkutt</title>
      </Helmet>
      {user.isSuccess ? (
        <Formik
          enableReinitialize
          initialValues={{
            name: user.data.name,
          }}
          validationSchema={() =>
            yup.object().shape({
              name: yup.string().min(6).max(200),
            })
          }
          onSubmit={async (values) => await submitHandler(values.name)}
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
                title={"Change Name"}
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
                <InputGroup
                  label="Name"
                  id="name"
                  containerClass="max-w-full"
                  value={values.name}
                  onChange={handleChange}
                  errorText={errors.name}
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

export default ChangeName;
