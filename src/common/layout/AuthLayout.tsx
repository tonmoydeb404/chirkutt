import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";

import Appbar from "../components/layout/Appbar";
import Navbar from "../components/layout/Navbar";

type AuthLayoutProps = {
  children?: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const auth = useAppSelector(selectAuth);

  return (
    <>
      <Navbar auth={auth} />
      <div className="container py-5 ">
        {children ? children : <Outlet context={auth} />}
      </div>
      <Appbar notifications={false} auth={auth} />
    </>
  );
};

export default AuthLayout;
