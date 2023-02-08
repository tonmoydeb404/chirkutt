export type NotificationType = {
  id: string;
  userID: string;
  eventID: string;
  type: "LIKE" | "COMMENT" | "OTHER";
  status: "SEEN" | "UNSEEN";
  text: string;
  createdAt: string | number;
  path: string;
};

export type NotificationDocumentType = {
  [key: string]: NotificationType;
};
