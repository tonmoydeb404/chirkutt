export type UserType = {
  uid: string;
  name: string;
  avatar: string;
  gender: "male" | "female" | "custom";
  bio: string;
  email: string;
  createdAt: string;
  isDeleted?: boolean | undefined;
};

export type UserDocumentType = {
  [key: string]: UserType;
};
