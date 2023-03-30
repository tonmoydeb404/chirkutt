import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { dicebearGender } from "../constants/dicebear.constant";
import { USERS } from "../constants/firebase.constant";
import { auth, db } from "../firebase";
import { UserType } from "../types/UserType";

type SignUpProps = {
  name: string;
  gender: "male" | "female" | "custom";
  email: string;
  password: string;
};
export const signup = async ({ name, gender, email, password }: SignUpProps) =>
  new Promise<UserCredential>(async (resolve, reject) => {
    try {
      // create user
      const userAuth = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // user details
      const uid = userAuth.user.uid;
      const avatar = `https://api.dicebear.com/5.x/micah/svg?${dicebearGender[gender]}&seed=${uid}`;
      // update profile after successfull login
      await updateProfile(userAuth.user, {
        displayName: name,
        photoURL: avatar,
      });
      // structure user data
      const user: UserType = {
        uid: userAuth.user.uid,
        name,
        email,
        avatar,
        gender,
        bio: "",
        createdAt:
          userAuth.user.metadata.creationTime || new Date().toISOString(),
      };
      // save data to database
      await setDoc(doc(db, USERS, userAuth.user.uid), user);
      // resolve request
      return resolve(userAuth);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

type SignInProps = {
  email: string;
  password: string;
};
export const signin = ({ email, password }: SignInProps) =>
  new Promise<UserCredential>(async (resolve, reject) => {
    try {
      // login
      const userAuth = await signInWithEmailAndPassword(auth, email, password);
      resolve(userAuth);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      reject(errorMsg);
    }
  });

export const signout = () =>
  new Promise(async (resolve, reject) => {
    try {
      await signOut(auth);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });

export const updateAuthPhoto = (url: string) =>
  new Promise<User>(async (resolve, reject) => {
    try {
      if (!auth.currentUser) throw Error("authorization error");
      await updateProfile(auth.currentUser, { photoURL: url });
      await auth.currentUser.reload();
      resolve(auth.currentUser);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      reject(errorMsg);
    }
  });

type UpdateAuth = { photoURL?: string; displayName?: string };

export const updateAuth = ({
  photoURL = undefined,
  displayName = undefined,
}: UpdateAuth) =>
  new Promise<User>(async (resolve, reject) => {
    try {
      if (!auth.currentUser) throw Error("authorization error");
      await updateProfile(auth.currentUser, { photoURL, displayName });
      await auth.currentUser.reload();
      resolve(auth.currentUser);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      reject(errorMsg);
    }
  });
