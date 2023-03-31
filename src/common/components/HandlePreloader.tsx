import { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";

const HandlePreloader = () => {
  const { status } = useAppSelector(selectAuth);

  useEffect(() => {
    if (status === "INTIAL") {
      document.documentElement.dataset.preloader = "true";
    } else {
      document.documentElement.dataset.preloader = "false";
    }
  }, [status]);
  return null;
};

export default HandlePreloader;
