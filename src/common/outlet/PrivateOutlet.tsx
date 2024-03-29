import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { AuthType } from "../../types/AuthType";

const PrivateOutlet = () => {
  const auth = useAppSelector(selectAuth);

  if (auth.status == "AUTHORIZED") return <Outlet context={auth} />;
  if (auth.status == "UNAUTHORIZED") return <Navigate to={"/"} replace />;

  return null;
};

export default PrivateOutlet;

// context
export const usePrivateAuth = () => useOutletContext<AuthType>();
