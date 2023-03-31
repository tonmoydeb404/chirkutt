import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Notfound - Chirkutt</title>
      </Helmet>
      <div className="flex w-full min-h-screen flex-col items-center justify-center fixed top-0 left-0 z-[10000]">
        <h2 className="text-5xl font-bold">404</h2>
        <p className="font-medium text-lg uppercase">page not found</p>
        <Link to={"/"} className="btn btn-primary mt-10">
          Back to home
        </Link>
      </div>
    </>
  );
};

export default NotFound;

// TODO: complete error page
