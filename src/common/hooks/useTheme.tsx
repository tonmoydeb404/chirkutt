import React, { useEffect, useRef, useState } from "react";
import website from "../constants/website.json";

type returnType = {
  theme: "dark" | "light";
  setTheme: React.Dispatch<React.SetStateAction<"dark" | "light">>;
  toggleTheme(): void;
};

const useTheme = (): returnType => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const firstRender = useRef<boolean>(false);

  // get theme on initial render
  useEffect(() => {
    const localTheme = localStorage.getItem(website.themeKey);
    if (localTheme === "light" || localTheme === "dark") {
      setTheme(localTheme);
    }
  }, []);

  // update on theme change
  useEffect(() => {
    if (firstRender.current) {
      localStorage.setItem(website.themeKey, theme);
    }

    // update first render
    firstRender.current = true;

    // update dom
    document.documentElement.classList.toggle("dark", theme == "dark");
  }, [theme]);

  // toggle theme
  const toggleTheme = (): void => {
    setTheme((prevTheme) => (prevTheme == "dark" ? "light" : "dark"));
  };

  return { theme, setTheme, toggleTheme };
};

export default useTheme;
