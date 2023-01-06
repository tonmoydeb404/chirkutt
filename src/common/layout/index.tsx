import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

type propTypes = {
  children: ReactNode;
};

const Layout = ({ children }: propTypes) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
