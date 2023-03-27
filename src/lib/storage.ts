import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

// image upload
export const uploadImage = (fileName: string, file: File) =>
  new Promise<string>(async (resolve, reject) => {
    try {
      if (!file) throw Error("file not found");
      const storageRef = ref(storage, fileName);
      const uploadTask = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadTask.ref);
      resolve(downloadUrl);
    } catch (error) {
      reject(error);
    }
  });
