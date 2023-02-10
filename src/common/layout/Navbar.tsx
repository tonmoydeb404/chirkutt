import { BiLogIn } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectTheme, toggleTheme } from "../../features/theme/themeSlice";
import iconList from "../../lib/iconList";
import { AuthType } from "../../types/AuthType";
import SearchBox from "../components/SearchBox";

const Navbar = ({ auth }: { auth: AuthType }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

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
          {auth?.status === "UNAUTHORIZED" ? (
            <Link to={"/signup"} className="btn btn-primary hidden sm:flex">
              <BiLogIn />
              join chirkutt
            </Link>
          ) : null}
          <button
            className="btn-icon btn-theme"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme.isDark ? iconList.light : iconList.dark}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
