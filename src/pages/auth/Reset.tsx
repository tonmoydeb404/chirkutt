import { Form, Formik, FormikHelpers } from "formik";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useResetPasswordMutation } from "../../api/usersApi";
import StatusText from "../../common/components/StatusText";
import InputGroup from "../../common/components/forms/InputGroup";
import iconList from "../../lib/iconList";

const Reset = () => {
  const [resetPassword, resetResult] = useResetPasswordMutation();

  const handleSubmit = async (
    { email }: { email: string },
    actions: FormikHelpers<{ email: string }>
  ) => {
    try {
      await resetPassword({ email }).unwrap();
    } catch (error) {
      console.log(error);
    }
    // reset form
    actions.resetForm();
  };

  return (
    <>
      <Helmet>
        <title>Reset Password - Chirkutt</title>
      </Helmet>
      <div className="py-10 max-w-[500px]">
        <h2 className="text-2xl mb-10 font-semibold flex items-center gap-1">
          <span className="text-primary-600">{iconList.password_reset}</span>{" "}
          Reset Password
        </h2>
        <StatusText
          isLoading={resetResult.isLoading}
          loadingText="sending reset password email"
          isError={resetResult.isError}
          errorText="could not sent reset password email"
          isSuccess={resetResult.isSuccess}
          successText="reset password email sent!"
        />
        <Formik
          initialValues={{ email: "" }}
          onSubmit={handleSubmit}
          validationSchema={() =>
            yup.object().shape({
              email: yup.string().email().required(),
            })
          }
        >
          {({ values, errors, handleChange, handleBlur, isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <InputGroup
                id="email"
                name="email"
                label="Email"
                placeholder="your@email.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                errorText={errors.email}
              />

              <button
                className="btn btn-primary max-w-[150px] justify-center mt-3"
                type="submit"
                disabled={resetResult.isLoading || isSubmitting}
              >
                Confirm Email
              </button>
              <div className="flex items-center gap-2 font-normal text-sm">
                <p>remember password?</p>
                <Link
                  to={"/signin"}
                  className="text-primary-600 hover:underline"
                >
                  back to login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Reset;

// TODO: complete password reset page
