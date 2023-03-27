import { useEffect, useState } from "react";
import { BiCheckDouble, BiError, BiLoader, BiX } from "react-icons/bi";

type StatusTextProps = {
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  errorText: string;
  loadingText: string;
  successText: string;
};

const StatusText = ({
  isLoading = false,
  isError = false,
  isSuccess = false,
  errorText = "",
  loadingText = "",
  successText = "",
}: StatusTextProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading || isError || isSuccess) {
      setShow(true);
    }
  }, [isLoading, isError, isSuccess]);
  return (
    <>
      {isError && show ? (
        <p className="p-4 dark:bg-error-600/40 bg-error-600/50 rounded mb-10 relative flex items-center gap-1 flex-wrap">
          <BiError />
          {errorText}
          <button
            className="text-sm absolute top-2 right-2 p-1 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-sm"
            onClick={() => setShow(false)}
          >
            <BiX />
          </button>
        </p>
      ) : null}
      {isLoading && show ? (
        <p className="p-4 bg-warning-500/60 dark:bg-warning-500/40 rounded mb-10 relative flex items-center gap-1 flex-wrap">
          <BiLoader className="animate-spin" />
          {loadingText}
          <button
            className="text-sm absolute top-2 right-2 p-1 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-sm"
            onClick={() => setShow(false)}
          >
            <BiX />
          </button>
        </p>
      ) : null}
      {isSuccess && show ? (
        <p className="p-4 dark:bg-success-600/40 bg-success-600/50 rounded mb-10 relative flex items-center gap-1 flex-wrap">
          <BiCheckDouble />
          {successText}
          <button
            className="text-sm absolute top-2 right-2 p-1 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-sm"
            onClick={() => setShow(false)}
          >
            <BiX />
          </button>
        </p>
      ) : null}
    </>
  );
};

export default StatusText;
