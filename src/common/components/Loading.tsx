import { BiLoaderAlt } from "react-icons/bi";

const Loading = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center fixed top-0 left-0 ">
      <div className="btn btn-primary">
        <BiLoaderAlt className="animate-spin" />
        Processing...
      </div>
    </div>
  );
};

export default Loading;
