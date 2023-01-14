import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { UserType } from "../common/types/UserType";
import { dicebearGender } from "../constants/dicebear.constant";
import { USERS } from "../constants/firebase.constant";
import { auth, db } from "../firebase";

type SignUpProps = {
  name: string;
  gender: "male" | "female" | "custom";
  email: string;
  password: string;
};
export const signup = ({ name, gender, email, password }: SignUpProps) =>
  new Promise(async (resolve, reject) => {
    try {
      // create user
      const userAuth = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // user details
      const username = email.split("@")[0];
      const avatar = `https://api.dicebear.com/5.x/micah/svg?${dicebearGender[gender]}&seed=${username}`;

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
        username,
        gender,
        bio: "",
        createdAt:
          userAuth.user.metadata.creationTime || new Date().toISOString(),
      };
      // save data to database
      await setDoc(doc(db, USERS, userAuth.user.uid), user);
      // resolve request
      return resolve({ uid: user.uid });
    } catch (error: any) {
      return reject({ ...error });
    }
  });

type SignInProps = {
  email: string;
  password: string;
};
export const signin = ({ email, password }: SignInProps) =>
  new Promise(async (resolve, reject) => {
    try {
      // login
      const userAuth = await signInWithEmailAndPassword(auth, email, password);
      // get data form database
      // const user = await getDoc(doc(db, USERS, userAuth.user.uid));
      // resolve request
      resolve({ uid: userAuth.user.uid });
    } catch (error) {
      reject({ error });
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
