import {
  EmailAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  deleteUser,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
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

type ReAuthenticate = {
  email: string;
  password: string;
};
export const reAuthenticate = ({ email, password }: ReAuthenticate) =>
  new Promise<User>(async (resolve, reject) => {
    try {
      if (!auth.currentUser) throw Error("authorization error");
      const credential = EmailAuthProvider.credential(email, password);
      const userCredential = await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );

      resolve(userCredential.user);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      reject(errorMsg);
    }
  });

type UpdateAuthPassword = {
  user: User;
  new_password: string;
};
export const updateAuthPassword = ({
  user,
  new_password,
}: UpdateAuthPassword) =>
  new Promise<User>(async (resolve, reject) => {
    try {
      if (!auth.currentUser) throw Error("authorization error");
      await updatePassword(user, new_password);
      resolve(user);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      reject(errorMsg);
    }
  });

type DeleteAuth = {
  user: User;
};
export const deleteAuth = ({ user }: DeleteAuth) =>
  new Promise<User>(async (resolve, reject) => {
    try {
      if (!auth.currentUser) throw Error("authorization error");
      await deleteUser(user);
      resolve(user);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      reject(errorMsg);
    }
  });

type ResetPassword = {
  email: string;
};
export const resetPassword = ({ email }: ResetPassword) =>
  new Promise<string>(async (resolve, reject) => {
    try {
      await sendPasswordResetEmail(auth, email);
      resolve("password reset email send");
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      reject(errorMsg);
    }
  });
