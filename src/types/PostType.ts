export type PostType = {
  id: string;
  text: string;
  createdAt: number;
  modifiedAt: number | null;
  likes: (string | number)[];
  authorUID: string;
};

export type PostDocumentType = {
  [key: string]: PostType;
};

export type PostDetailsType = {
  id: string;
  text: string;
  createdAt: number;
  modifiedAt: number | null;
  likes: (string | number)[];
  authorUID: string;
  author: {
    uid: string;
    name: string;
    avatar: string;
    isDeleted?: boolean | undefined;
  };
  comments: string[];
  isSaved: boolean;
};
