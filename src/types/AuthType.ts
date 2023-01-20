import { UserType } from "./UserType";

export type AuthType = {
    user: UserType | null;
    status: "INTIAL" | "LOADING" | "AUTHORIZED" | "UNAUTHORIZED";
};
