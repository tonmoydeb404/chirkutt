export type AuthUserType = {
  email: string;
  name: string;
  avatar: string;
  uid: string;
};

export type AuthType = {
  user: AuthUserType | null;
  status: "INTIAL" | "LOADING" | "AUTHORIZED" | "UNAUTHORIZED";
};
