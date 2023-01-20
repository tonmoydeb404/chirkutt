import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { openPostForm } from "../../features/postFormSlice";
import { signout } from "../../lib/auth";
import { ListItemType } from "../../types/ListType";
import LinkList from "../components/List";
import UserCard from "../components/UserCard";

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(selectAuth);

    const authorizedLinks: ListItemType[] = [
        { title: "Home", path: "/", icon: "home" },
        { title: "Profile", path: "/profile", icon: "person" },
        {
            title: "New Post",
            action: () => dispatch(openPostForm()),
            icon: "add",
        },
        { title: "Saved", path: "/saved", icon: "bookmarks" },
        { title: "Settings", path: "/settings", icon: "settings" },
        { title: "Sign Out", action: signout, icon: "signout" },
    ];

    const unauthorizedLinks: ListItemType[] = [
        { title: "Home", path: "/", icon: "home" },
        { title: "Sign up", path: "/signup", icon: "signup" },
        { title: "Sign in", path: "/signin", icon: "signin" },
    ];

    return (
        <aside className="flex flex-col gap-3 md:gap-5 w-[50px] md:w-[220px] max-[500px]:hidden">
            {user ? (
                <UserCard
                    title={user?.name}
                    username={user?.username}
                    avatar={user?.avatar}
                />
            ) : null}
            <LinkList items={user ? authorizedLinks : unauthorizedLinks} />
        </aside>
    );
};

export default Sidebar;
