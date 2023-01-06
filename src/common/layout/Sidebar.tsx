import LinkList from "../components/LinkList";
import UserCard from "../components/UserCard";
import { linkListLinkType } from "../types/linkList.type";

const sidebarLinks: linkListLinkType[] = [
  { title: "Home", path: "/", icon: "home" },
  { title: "Profile", path: "/profile", icon: "person" },
  { title: "Saved", path: "/saved", icon: "bookmark" },
  { title: "Settings", path: "/settings", icon: "settings" },
  { title: "Sign Out", path: "/signout", icon: "signout" },
];

const Sidebar = () => {
  return (
    <aside className="flex flex-col gap-5 w-[220px] ">
      <UserCard
        title="Chirkutt"
        username="chirkutt"
        avatar="/images/logo/chirkutt-logo-secondary.png"
      />
      <LinkList links={sidebarLinks} />
    </aside>
  );
};

export default Sidebar;
