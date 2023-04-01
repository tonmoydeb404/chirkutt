import { BiLogIn } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectTheme,
  toggleTheme,
} from "../../../../features/theme/themeSlice";
import iconList from "../../../../lib/iconList";
import { AuthType } from "../../../../types/AuthType";

const NavbarActions = ({ auth }: { auth: AuthType }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  return (
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
  );
};

export default NavbarActions;
