import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { AuthType } from "../../types/AuthType";

const PrivateOutlet = () => {
  const auth = useAppSelector(selectAuth);

  return auth.status !== "UNAUTHORIZED" ? (
    <Outlet context={auth} />
  ) : (
    <Navigate to={"/"} replace />
  );
};

export default PrivateOutlet;

// context
export const usePrivateAuth = () => useOutletContext<AuthType>();
