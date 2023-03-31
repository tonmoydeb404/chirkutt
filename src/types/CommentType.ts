export type CommentType = {
  id: string;
  text: string;
  authorUID: string;
  parentID: string | number | null;
  postID: string;
  createdAt: string | number;
};

export type CommentDetailsType = {
  id: string;
  text: string;
  authorUID: string;
  parentID: string | number | null;
  postID: string;
  createdAt: string | number;
  author: {
    uid: string;
    name: string;
    avatar: string;
    isDeleted?: boolean;
  };
};
