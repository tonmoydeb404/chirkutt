import { Unsubscribe } from "firebase/auth";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

// types
type QueryParam<T> = {
  key: keyof T;
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
};

/* ############################### */
/* ###### CREATE OPERATIONS ###### */
/* ############################### */

// create a single document
export const createDocument = (
  collectionName: string,
  documentId: string,
  data: { [key: string]: any },
  merge: boolean = false
) =>
  new Promise<boolean>(async (resolve, reject) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, data, { merge });
      resolve(true);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

/* ############################### */
/* ###### READ OPERATIONS ###### */
/* ############################### */

// read collection data
export const readCollection = <T>(collectionName: string) =>
  new Promise<T[]>(async (resolve, reject) => {
    try {
      const data: T[] = [];
      const querySnapshot = await getDocs(collection(db, collectionName));
      querySnapshot.forEach((doc) => {
        data.push(doc.data() as T);
      });
      resolve(data);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });
// read collection data in realtime
export const readCollectionRealtime = <T>(
  name: string,
  callback: (data: T[]) => void
): Unsubscribe => {
  const unsubscribe = onSnapshot(collection(db, name), (snapshot) => {
    let data: T[] = [];
    data = snapshot.docs.map((docRef) => docRef.data() as T);

    callback(data);
  });

  return unsubscribe;
};

// read a single document
export const readDocument = <T>(
  collectionName: string,
  documentId: string,
  forceCreate: boolean = false
) =>
  new Promise<T>(async (resolve, reject) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      let snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        // force to create document if not found
        if (forceCreate) {
          await setDoc(docRef, {});
          snapshot = await getDoc(docRef);
        } else {
          throw Error("document not found");
        }
      }

      const data: T = snapshot.data() as T;
      resolve(data);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });
// read a single document in realtime
export const readDocumentRealtime = <T>(
  documentId: string,
  collectionName: string,
  callback: (data: T) => void
): Unsubscribe => {
  let data: T;
  const unsubscribe = onSnapshot(
    doc(db, collectionName, documentId),
    (snapshot) => {
      data = snapshot.data() as T;
      callback(data);
    }
  );

  return unsubscribe;
};

// read query data
export const readQuery = <T extends { [key: string]: any }>(
  collectionName: string,
  queryParams: QueryParam<T>[]
) =>
  new Promise<T[]>(async (resolve, reject) => {
    try {
      const qParamList = queryParams.map((i) =>
        where(i.key as string, i.condition, i.value)
      );
      const queryRef = query(collection(db, collectionName), ...qParamList);
      const snapshot = await getDocs(queryRef);
      const data: T[] = [];
      snapshot.forEach((doc) => {
        data.push(doc.data() as T);
      });

      resolve(data);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });
// read query data in realtime
export const readQueryRealtime = <T>(
  collectionName: string,
  queryParams: QueryParam<T>[],
  callback: (data: T[]) => void
): Unsubscribe => {
  const qParamList = queryParams.map((i) =>
    where(i.key as string, i.condition, i.value)
  );
  const queryRef = query(collection(db, collectionName), ...qParamList);
  const unsubscribe = onSnapshot(queryRef, (snapshot) => {
    let data: T[] = [];
    snapshot.forEach((doc) => {
      data.push(doc.data() as T);
    });
    callback(data);
  });

  return unsubscribe;
};

/* ############################### */
/* ###### UPDATE OPERATIONS ###### */
/* ############################### */

// update any single document
export const updateDocument = <T>(
  collectionName: string,
  documentId: string,
  updates: Partial<T>
) =>
  new Promise<T>(async (resolve, reject) => {
    try {
      if (!Object.keys(updates).length) throw Error("updates not provided");
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, updates as object);

      // get updated data
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) throw Error("document not found");

      const data: T = snapshot.data() as T;
      resolve(data);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

// update multiple document at once
export const updateDocuments = <T>(
  collectionName: string,
  documentIdList: string[],
  updates: Partial<T>
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!Object.keys(updates).length) throw Error("updates not provided");

      const batch = writeBatch(db);

      documentIdList.forEach((id) => {
        const docRef = doc(db, collectionName, id);
        batch.update(docRef, updates as {});
      });

      await batch.commit();

      resolve(true);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

// update multiple fields from one document
export const updateFields = <T extends { [key: string]: any }>(
  collectionName: string,
  documentId: string,
  fields: string[],
  updates: Partial<T>
) =>
  new Promise(async (resolve, reject) => {
    try {
      if (typeof updates !== "object" || !Object.keys(updates).length) {
        throw Error("updates not provided");
      }
      const docRef = doc(db, collectionName, documentId);

      const updatedData = fields.reduce(
        (prev: { [key: string]: any }, current) => {
          Object.keys(updates).forEach((key) => {
            prev[`${current}.${key}`] = updates[key];
          });

          return prev;
        },
        {}
      );

      await updateDoc(docRef, { ...updatedData });

      resolve(true);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

/* ############################### */
/* ###### DELETE OPERATIONS ###### */
/* ############################### */

// delete a single document
export const deleteDocument = (collectionName: string, documentId: string) =>
  new Promise<boolean>(async (resolve, reject) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);

      resolve(true);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

// delete multiple document at once
export const deleteDocuments = (collectionName: string, documentId: string[]) =>
  new Promise(async (resolve, reject) => {
    try {
      const batch = writeBatch(db);

      documentId.forEach((id) => {
        const docRef = doc(db, collectionName, id);
        batch.delete(docRef);
      });

      await batch.commit();

      resolve(true);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

// delete multiple fields from one document
export const deleteDocumentFields = (
  collectionName: string,
  documentId: string,
  fieldNames: string[]
) =>
  new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      const fields = fieldNames.reduce(
        (prev: { [key: string]: any }, current) => {
          prev[current] = deleteField();
          return prev;
        },
        {}
      );

      await updateDoc(docRef, { ...fields });

      resolve(true);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

// delete by query items
export const deleteQuery = <T extends { [key: string]: any }>(
  collectionName: string,
  queryParams: QueryParam<T>[]
) =>
  new Promise<T[]>(async (resolve, reject) => {
    try {
      const qParamList = queryParams.map((i) =>
        where(i.key as string, i.condition, i.value)
      );
      const queryRef = query(collection(db, collectionName), ...qParamList);
      const snapshot = await getDocs(queryRef);
      const data: T[] = [];
      const batch = writeBatch(db);
      snapshot.forEach((doc) => {
        data.push(doc.data() as T);
        batch.delete(doc.ref);
      });

      await batch.commit();

      resolve(data);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });
