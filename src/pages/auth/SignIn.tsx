import { Formik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";
import InputGroup from "../../common/components/Forms/InputGroup";
import iconList from "../../common/lib/iconList";
import { signin } from "../../services/auth.service";

type SignInForm = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [viewPass, setViewPass] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);

  const toggleViewPass = (): void => {
    setViewPass((prevState) => !prevState);
  };

  const onSubmitHandler = async ({ email, password }: SignInForm) => {
    setErrorMsg(null);
    try {
      const response = await signin({ email, password });
      console.log(response);
    } catch (error: any) {
      setErrorMsg(error?.message);
      console.log(error);
    }
  };

  return (
    <div className="py-10">
      <h2 className="text-2xl mt-10 mb-10 font-semibold flex items-center gap-1">
        <span className="text-primary-600">{iconList.signin}</span> Login
        Chirkutt
      </h2>
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
        onSubmit={(v) => {
          console.log(v);
        }}
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
