import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "../firebase";

export const getCollection = <T>(name: string) =>
    new Promise(async (resolve, reject) => {
        try {
            const data: T[] = [];
            const querySnapshot = await getDocs(collection(db, name));
            querySnapshot.forEach((doc) => {
                data.push(doc.data() as T);
            });
            resolve(data);
        } catch (error: any) {
            const errorMsg =
                error.code || error.message || "something went wrong";
            return reject(errorMsg);
        }
    });

export const getDocument = <T>(documentId: string, collectionName: string) =>
    new Promise(async (resolve, reject) => {
        try {
            const snapshot = await getDoc(doc(db, collectionName, documentId));
            if (!snapshot.exists()) throw Error("document not found");

            const data: T = snapshot.data() as T;
            resolve(data);
        } catch (error: any) {
            const errorMsg =
                error.code || error.message || "something went wrong";
            return reject(errorMsg);
        }
    });

type QueryParams = {
    key: string;
    value: string;
    condition:
        | "<"
        | "<="
        | "=="
        | ">"
        | ">="
        | "!="
        | "in"
        | "not-in"
        | "array-contains"
        | "array-contains-any";
}[];
export const getQueryResult = <T>(
    queryParams: QueryParams,
    collectionName: string
) =>
    new Promise(async (resolve, reject) => {
        try {
            const qParamList = queryParams.map((i) =>
                where(i.key, i.condition, i.value)
            );
            const queryRef = query(
                collection(db, collectionName),
                ...qParamList
            );
            const snapshot = await getDocs(queryRef);
            const data: T[] = [];
            snapshot.forEach((doc) => {
                data.push(doc.data() as T);
            });

            resolve(data);
        } catch (error: any) {
            const errorMsg =
                error.code || error.message || "something went wrong";
            return reject(errorMsg);
        }
    });
