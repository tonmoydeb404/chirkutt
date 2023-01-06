import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type propTypes = {
  children: ReactNode;
};

const Layout = ({ children }: propTypes) => {
  return (
    <>
      <Navbar />
      <div className="container py-5 flex gap-5">
        <Sidebar />
        <div>{children}</div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
