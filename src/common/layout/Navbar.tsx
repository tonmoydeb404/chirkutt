import { BiLogIn, BiSearch, BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import IconList from "../lib/iconList";

const Navbar = () => {
  const authorized = true;
  return (
    <nav className="py-2.5 bg-neutral-50 border-b border-b-neutral-200">
      <div className="container flex items-center gap-2">
        {/* brand */}
        <Link to={"/"} className="text-xl font-semibold">
          <img
            src="/images/logo/chirkut-logo-primary.png"
            alt=""
            className="w-[38px]"
            title="chirkutt"
          />
        </Link>

        {/* search box */}
        <div className="relative flex-1 sm:flex-none max-w-[300px]">
          <input
            type="text"
            className="w-full sm:w-auto text-sm pr-4 rounded bg-neutral-50 focus:outline-none border border-neutral-200 focus:ring-1 focus:ring-primary-300"
            placeholder="search here..."
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <BiSearch />
          </button>
        </div>

        {/* actions button */}
        <div className="flex items-center gap-1 ml-auto">
          {!authorized ? (
            <Link to={"/signup"} className="btn btn-primary hidden sm:flex">
              <BiLogIn />
              join chirkutt
            </Link>
          ) : null}
          {authorized ? (
            <Link to={"/profile"} className="btn btn-light hidden sm:flex">
              <BiUser />
              tonmoydeb
            </Link>
          ) : null}
          <button className="btn-icon btn-secondary">
            <IconList.dark />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
