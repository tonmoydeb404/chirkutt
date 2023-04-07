export type PostType = {
  id: string;
  text: string;
  createdAt: number;
  modifiedAt: number | null;
  likes: (string | number)[];
  authorUID: string;
};

export type PostDocument = {
  [key: string]: PostType;
};

export type PostAuthor = {
  uid: string;
  name: string;
  avatar: string;
  isDeleted?: boolean | undefined;
};
export type PostDetails = {
  content: PostType;
  author: PostAuthor;
  comments: string[];
  isSaved: boolean;
};
