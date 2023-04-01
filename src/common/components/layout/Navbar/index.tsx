import { Link } from "react-router-dom";
import { AuthType } from "../../../../types/AuthType";
import NavbarActions from "./NavbarActions";
import NavbarSearch from "./NavbarSearch";

const Navbar = ({ auth }: { auth: AuthType }) => {
  return (
    <nav className="py-2.5 border-b bg-neutral-100 dark:bg-neutral-900 border-b-neutral-300 dark:border-b-neutral-800 sticky top-0 left-0 w-full z-[999]">
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
        <NavbarSearch />

        {/* actions button */}
        <NavbarActions auth={auth} />
      </div>
    </nav>
  );
};

export default Navbar;
