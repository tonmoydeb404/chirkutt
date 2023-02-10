import { Formik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useAppDispatch } from "../../app/hooks";
import InputGroup from "../../common/components/Forms/InputGroup";
import { authSignIn } from "../../features/auth/authSlice";
import { signin } from "../../lib/auth";
import iconList from "../../lib/iconList";
import { extractAuthUser } from "../../utilities/extractAuthUser";

type SignInForm = {
  email: string;
  password: string;
};

const SignIn = () => {
  const dispatch = useAppDispatch();
  const [viewPass, setViewPass] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);

  const toggleViewPass = (): void => {
    setViewPass((prevState) => !prevState);
  };

  const onSubmitHandler = async (
    { email, password }: SignInForm,
    { resetForm }: { resetForm: () => void }
  ) => {
    setErrorMsg(null);
    try {
      const response = await signin({ email, password });

      const user = extractAuthUser(response?.user);
      if (user === false) throw "something went to wrong. please try again";
      dispatch(authSignIn(user));
      resetForm();
    } catch (error: any) {
      setErrorMsg(error);
    }
  };

  return (
    <div className="py-10">
      <h2 className="text-2xl mt-5 mb-10 font-semibold flex items-center gap-1">
        <span className="text-primary-600">{iconList.signin}</span> Login
        Chirkutt
      </h2>
      {errorMsg ? (
        <p className="p-4 bg-error-600/30 rounded mb-10 max-w-[500px]">
          {errorMsg}
        </p>
      ) : null}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={() =>
          yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().min(6).required(),
          })
        }
        onSubmit={onSubmitHandler}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <InputGroup
              id="email"
              name="email"
              label="Email"
              placeholder="your@email.com"
              value={values.email}
              onChange={handleChange}
              errorText={errors.email}
              onBlur={handleBlur}
            />

            <InputGroup
              id="password"
              name="password"
              label="Password"
              placeholder={"*".repeat(8)}
              type={viewPass ? "text" : "password"}
              value={values.password}
              onChange={handleChange}
              errorText={errors.password}
              onBlur={handleBlur}
            >
              <button
                type="button"
                className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800"
                onClick={toggleViewPass}
              >
                {viewPass ? iconList.eye : iconList.eye_slash}
              </button>
            </InputGroup>

            <button
              className="btn btn-primary max-w-[100px] justify-center mt-5"
              type="submit"
            >
              Sign In
            </button>
            <div className="flex items-center gap-2 font-normal text-sm">
              <Link to={"/signup"} className="text-primary-600 hover:underline">
                Create new account
              </Link>
              <span>|</span>
              <Link to={"/reset"} className="text-primary-600 hover:underline">
                Forget password
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;
