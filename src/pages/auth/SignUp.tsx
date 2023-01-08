import { useState } from "react";
import { Link } from "react-router-dom";
import InputGroup from "../../common/components/Forms/InputGroup";
import iconList from "../../common/lib/iconList";

const SignUp = () => {
  const [viewPass, setViewPass] = useState<boolean>(false);

  const toggleViewPass = (): void => {
    setViewPass((prevState) => !prevState);
  };

  return (
    <div className="py-10">
      <h2 className="text-2xl mb-10 font-semibold flex items-center gap-1">
        <span className="text-primary-600">{iconList.signup}</span> Join
        Chirkutt
      </h2>
      <form className="flex flex-col gap-4">
        <InputGroup
          id="name"
          name="name"
          label="Name"
          placeholder="your name"
        />
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
        <InputGroup
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder={"*".repeat(8)}
          type={viewPass ? "text" : "password"}
        />

        <button
          className="btn btn-primary max-w-[100px] justify-center mt-5"
          type="submit"
        >
          Join
        </button>
        <div className="flex items-center gap-2 font-normal text-sm">
          <p>already have a account?</p>
          <Link to={"/signin"} className="text-primary-600 hover:underline">
            log in instead
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
