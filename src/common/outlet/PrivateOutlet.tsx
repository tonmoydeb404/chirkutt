import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";

const PrivateOutlet = () => {
    const { status } = useAppSelector(selectAuth);

    return status !== "UNAUTHORIZED" ? (
        <Outlet />
    ) : (
        <Navigate to={"/"} replace />
    );
};

export default PrivateOutlet;
