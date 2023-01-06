import { BiLogIn, BiSearch, BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import iconList from "../lib/iconList";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const authorized = true;
  return (
    <nav className="py-2.5 bg-neutral-50 dark:bg-neutral-900 border-b border-b-neutral-200 dark:border-b-neutral-800 ">
      <div className="container flex items-center gap-2">
        {/* brand */}
        <Link to={"/"} className="text-xl font-semibold">
          <img
            src="/images/logo/chirkutt-logo-primary.png"
            alt=""
            className="w-[38px]"
            title="chirkutt"
          />
        </Link>

        {/* search box */}
        <div className="relative flex-1 sm:flex-none max-w-[300px] sm:w-[300px]">
          <input
            type="text"
            className="w-full  text-sm pr-4 rounded bg-neutral-50 dark:bg-neutral-800 focus:outline-none border border-neutral-200 dark:border-neutral-700  focus:ring-1 focus:ring-primary-300"
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
            <Link to={"/profile"} className="btn btn-theme hidden sm:flex">
              <BiUser />
              tonmoydeb
            </Link>
          ) : null}
          <button className="btn-icon btn-secondary" onClick={toggleTheme}>
            {theme == "dark" ? iconList.light : iconList.dark}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
