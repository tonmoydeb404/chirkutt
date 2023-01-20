import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";

const PublicOutlet = () => {
    const { status } = useAppSelector(selectAuth);
    return status === "UNAUTHORIZED" ? (
        <Outlet />
    ) : (
        <Navigate to={"/profile"} replace />
    );
};

export default PublicOutlet;
