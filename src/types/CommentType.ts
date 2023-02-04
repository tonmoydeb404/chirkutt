export type CommentType = {
  id: string;
  text: string;
  authorUID: string | number;
  parentID: string | number | null;
  postID: string;
  createdAt: string | number;
};
