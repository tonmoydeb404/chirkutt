import { BiLogIn, BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import iconList from "../../lib/iconList";
import SearchBox from "../components/SearchBox";
import useTheme from "../hooks/useTheme";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAppSelector(selectAuth);

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
        <SearchBox />

        {/* actions button */}
        <div className="flex items-center gap-1 ml-auto">
          {!user ? (
            <Link to={"/signup"} className="btn btn-primary hidden sm:flex">
              <BiLogIn />
              join chirkutt
            </Link>
          ) : null}
          {user ? (
            <Link to={"/profile"} className="btn btn-theme hidden sm:flex">
              <BiUser />
              {user.username}
            </Link>
          ) : null}
          <button className="btn-icon btn-ghost" onClick={toggleTheme}>
            {theme == "dark" ? iconList.light : iconList.dark}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
