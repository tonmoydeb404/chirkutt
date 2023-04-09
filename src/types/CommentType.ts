export type Comment = {
  id: string;
  text: string;
  authorUID: string;
  parentID: string | number | null;
  postID: string;
  createdAt: number;
};

export type CommentDocument = {
  [key: string]: Comment;
};

export type CommentAuthor = {
  uid: string;
  name: string;
  avatar: string;
  isDeleted?: boolean;
};

export type CommentDetails = {
  author: CommentAuthor;
  comment: Comment;
};
