import { useState } from "react";
import { Link } from "react-router-dom";
import InputGroup from "../../common/components/Forms/InputGroup";
import iconList from "../../common/lib/iconList";

const SignIn = () => {
  const [viewPass, setViewPass] = useState<boolean>(false);

  const toggleViewPass = (): void => {
    setViewPass((prevState) => !prevState);
  };

  return (
    <div className="py-10">
      <h2 className="text-2xl mt-10 mb-10 font-semibold flex items-center gap-1">
        <span className="text-primary-600">{iconList.signin}</span> Login
        Chirkutt
      </h2>
      <form className="flex flex-col gap-4">
        <InputGroup
          id="email"
          name="email"
          label="Email"
          placeholder="your@email.com"
        />
        <InputGroup
          id="password"
          name="password"
          label="Password"
          placeholder={"*".repeat(8)}
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
    </div>
  );
};

export default SignIn;
