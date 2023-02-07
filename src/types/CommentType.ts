export type CommentType = {
  id: string;
  text: string;
  authorUID: string;
  parentID: string | number | null;
  postID: string;
  createdAt: string | number;
};
