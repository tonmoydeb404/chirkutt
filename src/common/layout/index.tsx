import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import PostForm from "../components/PostForm";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type propTypes = {
  children?: ReactNode;
  sidebar: boolean;
};

const Layout = ({ children, sidebar }: propTypes) => {
  return (
    <>
      <Navbar />
      <div className="container py-5 flex gap-3 md:gap-5">
        <div className="flex-1">{children ? children : <Outlet />}</div>
        {sidebar ? <Sidebar /> : null}
      </div>
      <MobileMenu />
      <Footer />
      <PostForm show={false} />
    </>
  );
};

export default Layout;
