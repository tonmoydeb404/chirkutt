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

export const getCollection = <T>(name: string) =>
  new Promise<T[]>(async (resolve, reject) => {
    try {
      const data: T[] = [];
      const querySnapshot = await getDocs(collection(db, name));
      querySnapshot.forEach((doc) => {
        data.push(doc.data() as T);
      });
      resolve(data);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

export const getDocument = <T>(
  documentId: string,
  collectionName: string,
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
export const getQueryResult = <T extends { [key: string]: any }>(
  queryParams: QueryParam<T>[],
  collectionName: string
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

export const updateDocument = <T>(
  documentId: string,
  collectionName: string,
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

export const updateDocuments = <T>(
  documentIdList: string[],
  collectionName: string,
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

export const deleteDocument = (documentId: string, collectionName: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);

      resolve(true);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

export const deleteDocumentFields = (
  documentId: string,
  collectionName: string,
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

export const createDocument = (
  documentId: string,
  collectionName: string,
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

export const getCollectionRealtime = <T>(
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

export const getDocumentRealtime = <T>(
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

export const getQueryResultRealtime = <T>(
  queryParams: QueryParam<T>[],
  collectionName: string,
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

// delete multiple document
export const deleteMultiDocument = (
  documentId: string[],
  collectionName: string
) =>
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

// update multiple fields
export const updateFields = <T extends { [key: string]: any }>(
  documentId: string,
  collectionName: string,
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

// delete by query
export const deleteDocumentByQuery = <T extends { [key: string]: any }>(
  queryParams: QueryParam<T>[],
  collectionName: string
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
        batch.delete(doc.ref);
      });

      await batch.commit();

      resolve(data);
    } catch (error: any) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });
