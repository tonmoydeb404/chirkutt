import { useAppDispatch } from "../../app/hooks";
import { openPostForm } from "../../features/postFormSlice";
import { signout } from "../../services/auth.service";
import LinkList from "../components/List";
import UserCard from "../components/UserCard";
import { ListItemType } from "../types/ListType";

const Sidebar = () => {
  const dispatch = useAppDispatch();

  const authorizedLinks: ListItemType[] = [
    { title: "Home", path: "/", icon: "home" },
    { title: "Profile", path: "/profile", icon: "person" },
    { title: "New Post", action: () => dispatch(openPostForm()), icon: "add" },
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
      <UserCard
        title="Chirkutt"
        username="chirkutt"
        avatar="/images/logo/chirkutt-logo-secondary.png"
      />
      <LinkList items={authorizedLinks} />
    </aside>
  );
};

export default Sidebar;
