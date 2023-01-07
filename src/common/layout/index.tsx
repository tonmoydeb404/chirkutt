import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
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
      <div className="container py-5 flex gap-5">
        {sidebar ? <Sidebar /> : null}
        <div>{children ? children : <Outlet />}</div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
