import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ReactNode, useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { USERS } from "../../constants/firebase.constant";
import { auth, db } from "../../firebase";
import { authLoading, authSignIn, authSignOut } from "./authSlice";

const AuthStateChanged = ({ children }: { children?: ReactNode }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            try {
                if (!userAuth) throw Error("user not loggedin");
                dispatch(authLoading());
                const userDoc = await getDoc(doc(db, USERS, userAuth.uid));
                const user = userDoc.data();

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
