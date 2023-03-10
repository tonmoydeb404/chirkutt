import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { AuthType } from "../../types/AuthType";
import Loading from "../components/Loading";

const PrivateOutlet = () => {
  const auth = useAppSelector(selectAuth);

  if (!auth.status || auth.status === "INTIAL") {
    return <Loading />;
  }

  if (auth.status == "AUTHORIZED") return <Outlet context={auth} />;

  return <Navigate to={"/"} replace />;
};

export default PrivateOutlet;

// context
export const usePrivateAuth = () => useOutletContext<AuthType>();
