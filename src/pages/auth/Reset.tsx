import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import InputGroup from "../../common/components/forms/InputGroup";
import iconList from "../../lib/iconList";

const Reset = () => {
  return (
    <>
      <Helmet>
        <title>Reset Password - Chirkutt</title>
      </Helmet>
      <div className="py-10">
        <h2 className="text-2xl mb-10 font-semibold flex items-center gap-1">
          <span className="text-primary-600">{iconList.password_reset}</span>{" "}
          Reset Password
        </h2>
        <form className="flex flex-col gap-4">
          <InputGroup
            id="email"
            name="email"
            label="Email"
            placeholder="your@email.com"
          />

          <button
            className="btn btn-primary max-w-[150px] justify-center mt-3"
            type="submit"
          >
            Confirm Email
          </button>
          <div className="flex items-center gap-2 font-normal text-sm">
            <p>remember password?</p>
            <Link to={"/signin"} className="text-primary-600 hover:underline">
              back to login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Reset;

// TODO: complete password reset page
