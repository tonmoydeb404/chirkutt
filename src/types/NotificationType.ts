export type NotificationType = {
  id: string;
  type: "LIKE" | "COMMENT" | "OTHER";
  status: "SEEN" | "UNSEEN";
  text: string;
  createdAt: string | number;
  path: string;
};
