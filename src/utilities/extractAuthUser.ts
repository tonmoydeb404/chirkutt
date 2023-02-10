import { User } from "firebase/auth";
import { AuthUserType } from "../types/AuthType";

export const extractAuthUser = (authUser: User): AuthUserType | false => {
  if (
    !authUser ||
    !authUser.uid ||
    !authUser.email ||
    !authUser.displayName ||
    !authUser.photoURL
  )
    return false;
  const user: AuthUserType = {
    name: authUser.displayName,
    uid: authUser.uid,
    email: authUser.email,
    avatar: authUser.photoURL,
  };

  return user;
};
