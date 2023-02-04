export type PostType = {
  id: string;
  text: string;
  createdAt: string;
  modifiedAt: string | null;
  likes: (string | number)[];
  authorUID: string;
};
