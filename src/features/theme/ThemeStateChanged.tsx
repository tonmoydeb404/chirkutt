import { ReactNode, useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectTheme } from "./themeSlice";

const ThemeStateChanged = ({ children }: { children: ReactNode }) => {
  const theme = useAppSelector(selectTheme);

  // change theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme.isDark);
  }, [theme]);

  return <>{children}</>;
};

export default ThemeStateChanged;
