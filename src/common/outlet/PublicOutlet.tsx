import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { AuthType } from "../../types/AuthType";
import Loading from "../components/Loading";

const PublicOutlet = () => {
  const auth = useAppSelector(selectAuth);

  if (!auth.status || auth.status === "INTIAL") {
    return <Loading />;
  }

  if (auth.status === "AUTHORIZED") {
    return <Navigate to={"/profile"} />;
  }

  return <Outlet context={auth} />;
};

export default PublicOutlet;

// context
export const usePublicAuth = () => useOutletContext<AuthType>();
