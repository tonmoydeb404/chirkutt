import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { auth } from "../../firebase";
import { extractAuthUser } from "../../utilities/extractAuthUser";
import { authLoading, authSignIn, authSignOut } from "./authSlice";

const AuthStateChanged = ({ children }: { children?: ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (!authUser) throw Error("user not loggedin");
        dispatch(authLoading());
        const user = extractAuthUser(authUser);
        if (user === false) throw Error("auth user is not valid");
        dispatch(authSignIn(user));
      } catch (error) {
        // console.log(error);
        dispatch(authSignOut());
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
};

export default AuthStateChanged;
